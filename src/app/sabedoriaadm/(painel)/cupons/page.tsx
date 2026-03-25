import type { Metadata } from "next";
import { getAdminSupabase } from "@/lib/admin/supabase";
import { CuponsClient } from "./CuponsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cupons | Admin SM",
  robots: "noindex, nofollow",
};

export default async function CuponsPage() {
  const db = getAdminSupabase();
  const { data } = await db
    .from("coupons")
    .select("id, code, is_active, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">Cupons</h1>
      <CuponsClient initial={data ?? []} />
    </div>
  );
}
