import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.ABACATEPAY_API_KEY ?? "";

  // Só funciona com chave de desenvolvimento
  if (!apiKey.startsWith("abc_dev_")) {
    return NextResponse.json({ error: "Simulação indisponível em produção." }, { status: 403 });
  }

  const { pixId } = await request.json();
  if (!pixId) {
    return NextResponse.json({ error: "pixId obrigatório." }, { status: 400 });
  }

  const res = await fetch(
    `https://api.abacatepay.com/v1/pixQrCode/simulate-payment?id=${pixId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ metadata: {} }),
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.ok ? 200 : 400 });
}
