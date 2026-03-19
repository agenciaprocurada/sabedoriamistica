import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/verifyRequest";
import { getAdminSupabase } from "@/lib/admin/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await verifyAdminRequest(request);
  if (denied) return denied;

  const db = getAdminSupabase();
  const { id } = params;

  const [
    { data: profile },
    { data: dreams },
    { data: payments },
  ] = await Promise.all([
    db.from("profiles").select("*").eq("id", id).single(),
    db
      .from("dreams")
      .select("id, description, free_analysis, paid_analysis, status, is_paid, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false }),
    db
      .from("payments")
      .select("id, amount, status, created_at, completed_at, abacate_billing_id")
      .eq("user_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!profile) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

  return NextResponse.json({ profile, dreams: dreams ?? [], payments: payments ?? [] });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await verifyAdminRequest(request);
  if (denied) return denied;

  const { name, email } = await request.json();
  const db = getAdminSupabase();

  const updates: Record<string, string> = {};
  if (name) updates.name = name;
  if (email) updates.email = email;

  const { error } = await db
    .from("profiles")
    .update(updates)
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
