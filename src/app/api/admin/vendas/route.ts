import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/verifyRequest";
import { getAdminSupabase } from "@/lib/admin/supabase";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const denied = await verifyAdminRequest(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const status = searchParams.get("status") ?? "";
  const period = searchParams.get("period") ?? "";

  const db = getAdminSupabase();
  let query = db
    .from("payments")
    .select(
      `id, amount, status, created_at, completed_at, abacate_billing_id,
       profiles!user_id(name, email),
       dreams!dream_id(description, free_analysis, paid_analysis)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (status) query = query.eq("status", status);

  if (period === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    query = query.gte("created_at", start.toISOString());
  } else if (period === "7d") {
    query = query.gte(
      "created_at",
      new Date(Date.now() - 7 * 86400_000).toISOString()
    );
  } else if (period === "30d") {
    query = query.gte(
      "created_at",
      new Date(Date.now() - 30 * 86400_000).toISOString()
    );
  }

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, count, page, pageSize: PAGE_SIZE });
}
