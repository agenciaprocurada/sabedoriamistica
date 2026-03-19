import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/verifyRequest";
import { getAdminSupabase } from "@/lib/admin/supabase";

export async function GET(request: NextRequest) {
  const denied = await verifyAdminRequest(request);
  if (denied) return denied;

  const db = getAdminSupabase();

  const [
    { count: totalUsers },
    { count: totalDreams },
    { count: totalSales },
    { data: revenueData },
  ] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }),
    db
      .from("dreams")
      .select("*", { count: "exact", head: true })
      .neq("status", "pending"),
    db
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed"),
    db.from("payments").select("amount").eq("status", "completed"),
  ]);

  const totalRevenue = (revenueData ?? []).reduce(
    (sum, p) => sum + (p.amount ?? 0),
    0
  );

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    totalDreams: totalDreams ?? 0,
    totalSales: totalSales ?? 0,
    totalRevenue,
  });
}
