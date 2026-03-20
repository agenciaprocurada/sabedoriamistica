import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { dreamId } = await request.json();
    if (!dreamId) {
      return NextResponse.json({ error: "dreamId obrigatório." }, { status: 400 });
    }

    // Verifica se o sonho existe e pertence ao usuário
    const { data: dream } = await supabase
      .from("dreams")
      .select("id, is_paid")
      .eq("id", dreamId)
      .eq("user_id", user.id)
      .single();

    if (!dream) {
      return NextResponse.json({ error: "Sonho não encontrado." }, { status: 404 });
    }

    if (dream.is_paid) {
      return NextResponse.json({ error: "Sonho já foi pago." }, { status: 400 });
    }

    // Busca perfil do usuário
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, email, cellphone, tax_id")
      .eq("id", user.id)
      .single();

    if (!profile?.cellphone || !profile?.tax_id) {
      return NextResponse.json(
        { error: "Preencha seus dados pessoais antes de pagar.", redirect: "/meus-dados" },
        { status: 422 }
      );
    }

    // Reutiliza PIX pendente criado nos últimos 50 minutos
    const cutoff = new Date(Date.now() - 50 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from("payments")
      .select("abacate_billing_id, abacate_billing_url, brcode, created_at")
      .eq("dream_id", dreamId)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .like("abacate_billing_id", "pix_char_%")
      .gte("created_at", cutoff)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing?.abacate_billing_id && existing?.abacate_billing_url) {
      // Recalcula expiresAt a partir do created_at + 60 min
      const expiresAt = new Date(
        new Date(existing.created_at).getTime() + 60 * 60 * 1000
      ).toISOString();
      return NextResponse.json({
        pixId: existing.abacate_billing_id,
        brCode: existing.brcode ?? null,
        brCodeBase64: existing.abacate_billing_url,
        expiresAt,
        amount: 990,
      });
    }

    // Cria novo PIX QR Code via AbacatePay
    const apiKey = process.env.ABACATEPAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ABACATEPAY_API_KEY não configurada." }, { status: 500 });
    }

    const pixRes = await fetch("https://api.abacatepay.com/v1/pixQrCode/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 990,
        expiresIn: 3600,
        description: "Interpretacao Completa de Sonho - Sabedoria Mistica",
        customer: {
          name: profile.name || "Cliente",
          cellphone: profile.cellphone,
          email: profile.email || user.email || "",
          taxId: profile.tax_id,
        },
      }),
    });

    const pixData = await pixRes.json();
    if (!pixRes.ok || !pixData?.data?.id) {
      console.error("AbacatePay PIX error:", pixData);
      return NextResponse.json(
        { error: pixData?.error ?? "Erro ao gerar PIX." },
        { status: 500 }
      );
    }

    const pix = pixData.data;

    // Salva na tabela de payments
    await supabase.from("payments").insert({
      user_id: user.id,
      dream_id: dreamId,
      amount: 990,
      status: "pending",
      abacate_billing_id: pix.id,
      abacate_billing_url: pix.brCodeBase64,
      brcode: pix.brCode ?? null,
    });

    return NextResponse.json({
      pixId: pix.id,
      brCode: pix.brCode,
      brCodeBase64: pix.brCodeBase64,
      expiresAt: pix.expiresAt,
      amount: pix.amount,
      devMode: pix.devMode ?? false,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Criar PIX error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
