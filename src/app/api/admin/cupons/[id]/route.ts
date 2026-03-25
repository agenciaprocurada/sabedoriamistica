import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/verifyRequest";
import { getAdminSupabase } from "@/lib/admin/supabase";

// PATCH — ativa / desativa cupom
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await verifyAdminRequest(request);
  if (denied) return denied;

  const body = await request.json();
  if (typeof body.is_active !== "boolean") {
    return NextResponse.json({ error: "Campo is_active obrigatório." }, { status: 400 });
  }

  const db = getAdminSupabase();
  const { data, error } = await db
    .from("coupons")
    .update({ is_active: body.is_active })
    .eq("id", params.id)
    .select("id, code, is_active, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// DELETE — remove cupom permanentemente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await verifyAdminRequest(request);
  if (denied) return denied;

  const db = getAdminSupabase();
  const { error } = await db.from("coupons").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
