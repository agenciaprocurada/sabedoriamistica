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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { dreamId, pixId } = await request.json();
    if (!dreamId || !pixId) {
      return NextResponse.json({ error: "dreamId e pixId obrigatórios." }, { status: 400 });
    }

    // Verifica se já foi marcado como pago localmente (idempotência)
    const { data: payment } = await supabase
      .from("payments")
      .select("id, status")
      .eq("dream_id", dreamId)
      .eq("user_id", user.id)
      .eq("abacate_billing_id", pixId)
      .maybeSingle();

    if (payment?.status === "completed") {
      return NextResponse.json({ isPaid: true });
    }

    // Consulta status do PIX na AbacatePay
    const apiKey = process.env.ABACATEPAY_API_KEY;
    if (!apiKey) return NextResponse.json({ isPaid: false });

    const checkRes = await fetch(
      `https://api.abacatepay.com/v1/pixQrCode/check?id=${pixId}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    const checkData = await checkRes.json();
    const pixStatus: string = checkData?.data?.status ?? "";

    console.log("PIX status para", pixId, ":", pixStatus);

    if (pixStatus !== "PAID") {
      return NextResponse.json({ isPaid: false, status: pixStatus });
    }

    // Pagamento confirmado — processa
    const serviceSupabase = getServiceClient();

    const { data: dream } = await serviceSupabase
      .from("dreams")
      .select("id, description, free_analysis, is_paid")
      .eq("id", dreamId)
      .single();

    if (!dream || dream.is_paid) {
      return NextResponse.json({ isPaid: true });
    }

    // Atualiza payment
    if (payment) {
      await serviceSupabase
        .from("payments")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", payment.id);
    }

    // Marca is_paid=true imediatamente
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
        .catch((err) => console.error("Erro ao gerar análise paga (pix):", err))
    );

    return NextResponse.json({ isPaid: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Verificar PIX error:", msg);
    return NextResponse.json({ isPaid: false });
  }
}
