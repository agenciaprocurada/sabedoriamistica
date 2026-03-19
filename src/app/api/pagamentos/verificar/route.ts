import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { generateDreamAnalysis } from "@/lib/gemini/client";
import { waitUntil } from "@vercel/functions";

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = await request.json();
    const dreamId: string = body.dreamId;

    if (!dreamId) {
      return NextResponse.json({ error: "dreamId obrigatório." }, { status: 400 });
    }

    // Busca o pagamento pendente deste sonho
    const { data: payment } = await supabase
      .from("payments")
      .select("id, abacate_billing_id, status")
      .eq("dream_id", dreamId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!payment?.abacate_billing_id) {
      return NextResponse.json({ isPaid: false });
    }

    // Já processado localmente
    if (payment.status === "completed") {
      return NextResponse.json({ isPaid: true });
    }

    const apiKey = process.env.ABACATEPAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ isPaid: false });
    }

    // Consulta lista de billings e filtra pelo ID
    const apiRes = await fetch(
      "https://api.abacatepay.com/v1/billing/list",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      }
    );

    if (!apiRes.ok) {
      console.warn("AbacatePay verificar status:", apiRes.status);
      return NextResponse.json({ isPaid: false });
    }

    const result = await apiRes.json();
    const billings: { id: string; status: string }[] = result?.data ?? [];
    const billing = billings.find((b) => b.id === payment.abacate_billing_id);
    const billingStatus: string = billing?.status ?? "";

    console.log("AbacatePay billing status para", payment.abacate_billing_id, ":", billingStatus);

    if (billingStatus !== "PAID") {
      return NextResponse.json({ isPaid: false });
    }

    // Pagamento confirmado — processa igual ao webhook
    const serviceSupabase = getServiceClient();

    // Idempotência
    const { data: dream } = await serviceSupabase
      .from("dreams")
      .select("id, description, free_analysis, is_paid")
      .eq("id", dreamId)
      .single();

    if (!dream) {
      return NextResponse.json({ isPaid: false });
    }

    if (dream.is_paid) {
      return NextResponse.json({ isPaid: true });
    }

    // Atualiza payment
    await serviceSupabase
      .from("payments")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", payment.id);

    // Marca is_paid=true imediatamente para liberar o PaymentPolling
    await serviceSupabase
      .from("dreams")
      .update({ is_paid: true, status: "paid_analyzed" })
      .eq("id", dreamId);

    // Gera análise em background (continuando a partir da free)
    waitUntil(
      generateDreamAnalysis(dream.description, "paid", dream.free_analysis ?? undefined)
        .then((paidAnalysis) =>
          serviceSupabase
            .from("dreams")
            .update({ paid_analysis: paidAnalysis })
            .eq("id", dreamId)
        )
        .catch((err) => console.error("Erro ao gerar análise paga (verificar):", err))
    );

    return NextResponse.json({ isPaid: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Verificar pagamento error:", msg);
    return NextResponse.json({ isPaid: false });
  }
}
