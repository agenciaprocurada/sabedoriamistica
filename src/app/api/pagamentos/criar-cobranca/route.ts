import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PRODUCTS } from "@/lib/abacatepay/config";

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

    const apiKey = process.env.ABACATEPAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ABACATEPAY_API_KEY não configurada." }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3004";

    // Busca perfil do usuário (incluindo dados de pagamento)
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, email, cellphone, tax_id")
      .eq("id", user.id)
      .single();

    // Exige dados de pagamento preenchidos
    if (!profile?.cellphone || !profile?.tax_id) {
      return NextResponse.json(
        { error: "Preencha seus dados pessoais antes de pagar.", redirect: "/meus-dados" },
        { status: 422 }
      );
    }

    // Reutiliza billing pendente existente para este sonho
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("abacate_billing_url")
      .eq("dream_id", dreamId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingPayment?.abacate_billing_url) {
      return NextResponse.json({ billingUrl: existingPayment.abacate_billing_url });
    }

    // AbacatePay sempre cria um produto novo por billing (limitação da API deles)
    // externalId único evita conflito; reuso de billing pendente já minimiza criações
    const billingRef = `dream-${dreamId.slice(0, 8)}-${Date.now()}`;
    const payload = {
      frequency: "ONE_TIME",
      methods: ["PIX"],
      products: [
        {
          externalId: billingRef,
          name: PRODUCTS.dream_analysis.name,
          quantity: PRODUCTS.dream_analysis.quantity,
          price: PRODUCTS.dream_analysis.price,
        },
      ],
      returnUrl: `${appUrl}/sonhos/completo/${dreamId}`,
      completionUrl: `${appUrl}/sonhos/completo/${dreamId}`,
      customer: {
        name: profile.name || "Cliente",
        email: profile.email || user.email || "",
        cellphone: profile.cellphone,
        taxId: profile.tax_id,
      },
    };

    console.log("AbacatePay payload:", JSON.stringify(payload));

    const apiResponse = await fetch("https://api.abacatepay.com/v1/billing/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawText = await apiResponse.text();
    console.log("AbacatePay status:", apiResponse.status, "body:", rawText);

    let result: { data?: { id: string; url: string }; error?: string } = {};
    try {
      result = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: `AbacatePay retornou resposta inválida (${apiResponse.status}): ${rawText.slice(0, 200)}` },
        { status: 500 }
      );
    }

    if (!apiResponse.ok || result.error || !result.data) {
      return NextResponse.json(
        { error: `AbacatePay (${apiResponse.status}): ${result.error ?? JSON.stringify(result)}` },
        { status: 500 }
      );
    }

    const billing = result.data;

    await supabase.from("payments").insert({
      user_id: user.id,
      dream_id: dreamId,
      amount: PRODUCTS.dream_analysis.price,
      status: "pending",
      abacate_billing_id: billing.id,
      abacate_billing_url: billing.url,
    });

    return NextResponse.json({ billingUrl: billing.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Criar cobrança error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
