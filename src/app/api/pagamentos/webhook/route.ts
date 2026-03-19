import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateDreamAnalysis } from "@/lib/gemini/client";

// Webhook usa service-role key para bypass RLS (operação interna)
function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação básica do evento
    const event = body?.event as string;
    const data = body?.data;

    if (event !== "billing.paid" || !data) {
      return NextResponse.json({ received: true });
    }

    const billingId: string = data?.billing?.id ?? data?.id;

    if (!billingId) {
      console.error("Webhook billing.paid sem billing ID:", body);
      return NextResponse.json({ received: true });
    }

    const supabase = createServiceClient();

    // Busca o payment pelo billing ID
    const { data: payment } = await supabase
      .from("payments")
      .select("id, dream_id, status")
      .eq("abacate_billing_id", billingId)
      .single();

    if (!payment) {
      console.error("Payment não encontrado para billing:", billingId);
      return NextResponse.json({ received: true });
    }

    // Idempotência: ignora se já foi processado
    if (payment.status === "completed") {
      return NextResponse.json({ received: true });
    }

    // Atualiza payment
    await supabase
      .from("payments")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", payment.id);

    // Busca o sonho
    const { data: dream } = await supabase
      .from("dreams")
      .select("id, description")
      .eq("id", payment.dream_id)
      .single();

    if (!dream) {
      console.error("Dream não encontrado para payment:", payment.id);
      return NextResponse.json({ received: true });
    }

    // Gera análise completa via Gemini
    let paidAnalysis: string;
    try {
      paidAnalysis = await generateDreamAnalysis(dream.description, "paid");
    } catch (err) {
      console.error("Erro ao gerar análise paga:", err);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Salva análise no dream
    await supabase
      .from("dreams")
      .update({
        paid_analysis: paidAnalysis,
        is_paid: true,
        status: "paid_analyzed",
      })
      .eq("id", dream.id);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    // Retorna 200 para evitar reenvios desnecessários
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
