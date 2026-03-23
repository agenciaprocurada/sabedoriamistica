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
    const code: string = (body.code ?? "").trim().toUpperCase();

    if (!dreamId || !code) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const serviceSupabase = getServiceClient();

    // Valida o cupom
    const { data: coupon } = await serviceSupabase
      .from("coupons")
      .select("id, code, is_active")
      .eq("code", code)
      .eq("is_active", true)
      .maybeSingle();

    if (!coupon) {
      return NextResponse.json({ error: "Cupom inválido ou expirado." }, { status: 400 });
    }

    // Busca o sonho
    const { data: dream } = await serviceSupabase
      .from("dreams")
      .select("id, description, free_analysis, is_paid")
      .eq("id", dreamId)
      .eq("user_id", user.id)
      .single();

    if (!dream) {
      return NextResponse.json({ error: "Sonho não encontrado." }, { status: 404 });
    }

    if (dream.is_paid) {
      return NextResponse.json({ success: true });
    }

    // Marca como pago imediatamente
    await serviceSupabase
      .from("dreams")
      .update({ is_paid: true, status: "paid_analyzed" })
      .eq("id", dreamId);

    // Gera análise completa em background
    waitUntil(
      generateDreamAnalysis(dream.description, "paid", dream.free_analysis ?? undefined)
        .then((paidAnalysis) =>
          serviceSupabase
            .from("dreams")
            .update({ paid_analysis: paidAnalysis })
            .eq("id", dreamId)
        )
        .catch((err) => console.error("Erro ao gerar análise (cupom):", err))
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Cupom aplicar error:", msg);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
