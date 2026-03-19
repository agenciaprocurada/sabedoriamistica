import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/verifyRequest";
import { getAdminSupabase } from "@/lib/admin/supabase";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const denied = await verifyAdminRequest(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const search = searchParams.get("search") ?? "";

  const db = getAdminSupabase();
  let query = db
    .from("profiles")
    .select("id, name, email, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data: profiles, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Busca contagens de sonhos e compras para cada usuário
  const ids = (profiles ?? []).map((p) => p.id);
  const [{ data: dreamCounts }, { data: paymentCounts }] = await Promise.all([
    db
      .from("dreams")
      .select("user_id")
      .in("user_id", ids),
    db
      .from("payments")
      .select("user_id")
      .eq("status", "completed")
      .in("user_id", ids),
  ]);

  const dreamMap: Record<string, number> = {};
  const payMap: Record<string, number> = {};
  (dreamCounts ?? []).forEach((d) => { dreamMap[d.user_id] = (dreamMap[d.user_id] ?? 0) + 1; });
  (paymentCounts ?? []).forEach((p) => { payMap[p.user_id] = (payMap[p.user_id] ?? 0) + 1; });

  const data = (profiles ?? []).map((p) => ({
    ...p,
    dreamCount: dreamMap[p.id] ?? 0,
    purchaseCount: payMap[p.id] ?? 0,
  }));

  return NextResponse.json({ data, count, page, pageSize: PAGE_SIZE });
}
