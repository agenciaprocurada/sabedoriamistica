import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = await request.json();
    const { name, cellphone, tax_id } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
    }

    const cleanCellphone = (cellphone ?? "").replace(/\D/g, "");
    if (cleanCellphone.length < 10) {
      return NextResponse.json(
        { error: "Telefone inválido. Informe DDD + número." },
        { status: 400 }
      );
    }

    const cleanTaxId = (tax_id ?? "").replace(/\D/g, "");
    if (cleanTaxId.length !== 11 && cleanTaxId.length !== 14) {
      return NextResponse.json(
        { error: "CPF (11 dígitos) ou CNPJ (14 dígitos) inválido." },
        { status: 400 }
      );
    }

    if (cleanTaxId.length === 11) {
      if (/^(\d)\1+$/.test(cleanTaxId)) {
        return NextResponse.json({ error: "CPF inválido." }, { status: 400 });
      }
      let sum = 0;
      for (let i = 0; i < 9; i++) sum += parseInt(cleanTaxId[i]) * (10 - i);
      let r = (sum * 10) % 11;
      if (r === 10 || r === 11) r = 0;
      if (r !== parseInt(cleanTaxId[9])) {
        return NextResponse.json({ error: "CPF inválido. Verifique os números." }, { status: 400 });
      }
      sum = 0;
      for (let i = 0; i < 10; i++) sum += parseInt(cleanTaxId[i]) * (11 - i);
      r = (sum * 10) % 11;
      if (r === 10 || r === 11) r = 0;
      if (r !== parseInt(cleanTaxId[10])) {
        return NextResponse.json({ error: "CPF inválido. Verifique os números." }, { status: 400 });
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        name: name.trim(),
        cellphone: cleanCellphone,
        tax_id: cleanTaxId,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Perfil update error:", error);
      return NextResponse.json({ error: "Erro ao salvar. Tente novamente." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
