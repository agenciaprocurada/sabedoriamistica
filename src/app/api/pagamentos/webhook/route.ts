import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "crypto";
import { generateDreamAnalysis } from "@/lib/gemini/client";
import { waitUntil } from "@vercel/functions";

// Webhook usa service-role key para bypass RLS (operação interna)
function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Verifica se o secret enviado na query string bate com ABACATEPAY_WEBHOOK_SECRET.
 * Usa timingSafeEqual para evitar timing attacks.
 */
function verifyWebhookSecret(url: string): boolean {
  const expected = process.env.ABACATEPAY_WEBHOOK_SECRET;
  if (!expected) {
    console.error("ABACATEPAY_WEBHOOK_SECRET não configurado — webhook bloqueado.");
    return false;
  }

  const { searchParams } = new URL(url);
  const received = searchParams.get("secret") ?? "";

  if (!received) return false;

  try {
    const a = Buffer.from(received);
    const b = Buffer.from(expected);
    // buffers devem ter o mesmo tamanho para timingSafeEqual
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // ── 1. Autenticação do webhook ──────────────────────────────────────────
  if (!verifyWebhookSecret(request.url)) {
    console.warn("Webhook recebido com secret inválido:", request.url);
    // Retorna 200 para não revelar ao atacante que o secret está errado
    return NextResponse.json({ received: true }, { status: 200 });
  }

  try {
    // ── 2. Lê o raw body ANTES do parse (boa prática para futuro HMAC) ───
    const rawBody = await request.text();
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody);
    } catch {
      console.error("Webhook body inválido (não é JSON)");
      return NextResponse.json({ received: true });
    }

    // ── 3. Validação básica do evento ────────────────────────────────────
    const event = body?.event as string;
    const data = body?.data as Record<string, unknown> | undefined;

    if (event !== "billing.paid" || !data) {
      return NextResponse.json({ received: true });
    }

    const billingData = data?.billing as Record<string, unknown> | undefined;
    const billingId: string =
      (billingData?.id as string) ?? (data?.id as string) ?? "";

    if (!billingId) {
      console.error("Webhook billing.paid sem billing ID:", body);
      return NextResponse.json({ received: true });
    }

    const supabase = createServiceClient();

    // ── 4. Busca o payment pelo billing ID ──────────────────────────────
    const { data: payment } = await supabase
      .from("payments")
      .select("id, dream_id, status")
      .eq("abacate_billing_id", billingId)
      .single();

    if (!payment) {
      console.error("Payment não encontrado para billing:", billingId);
      return NextResponse.json({ received: true });
    }

    // ── 5. Idempotência: ignora se já foi processado ─────────────────────
    if (payment.status === "completed") {
      return NextResponse.json({ received: true });
    }

    // ── 6. Atualiza payment ──────────────────────────────────────────────
    await supabase
      .from("payments")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", payment.id);

    // ── 7. Busca o sonho ─────────────────────────────────────────────────
    const { data: dream } = await supabase
      .from("dreams")
      .select("id, description, free_analysis")
      .eq("id", payment.dream_id)
      .single();

    if (!dream) {
      console.error("Dream não encontrado para payment:", payment.id);
      return NextResponse.json({ received: true });
    }

    // ── 8. Marca is_paid=true imediatamente ─────────────────────────────
    await supabase
      .from("dreams")
      .update({ is_paid: true, status: "paid_analyzed" })
      .eq("id", dream.id);

    // ── 9. Gera análise em background ────────────────────────────────────
    waitUntil(
      generateDreamAnalysis(dream.description, "paid", dream.free_analysis ?? undefined)
        .then((paidAnalysis) =>
          supabase
            .from("dreams")
            .update({ paid_analysis: paidAnalysis })
            .eq("id", dream.id)
        )
        .catch((err) => console.error("Erro ao gerar análise paga (webhook):", err))
    );

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
