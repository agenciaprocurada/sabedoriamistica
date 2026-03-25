import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/verifyRequest";
import { getAdminSupabase } from "@/lib/admin/supabase";

// GET — lista todos os cupons
export async function GET(request: NextRequest) {
  const denied = await verifyAdminRequest(request);
  if (denied) return denied;

  const db = getAdminSupabase();
  const { data, error } = await db
    .from("coupons")
    .select("id, code, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST — cria novo cupom
export async function POST(request: NextRequest) {
  const denied = await verifyAdminRequest(request);
  if (denied) return denied;

  const body = await request.json();
  const code: string = (body.code ?? "").trim().toUpperCase();

  if (!code || code.length < 3) {
    return NextResponse.json({ error: "Código inválido (mínimo 3 caracteres)." }, { status: 400 });
  }
  if (!/^[A-Z0-9_-]+$/.test(code)) {
    return NextResponse.json(
      { error: "Use apenas letras maiúsculas, números, _ e -." },
      { status: 400 }
    );
  }

  const db = getAdminSupabase();
  const { data, error } = await db
    .from("coupons")
    .insert({ code, is_active: true })
    .select("id, code, is_active, created_at")
    .single();

  if (error) {
    const msg = error.code === "23505" ? "Este código já existe." : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  return NextResponse.json({ data }, { status: 201 });
}
