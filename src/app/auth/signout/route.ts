import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createClient();
  await supabase.auth.signOut();

  const headersList = headers();
  const origin = headersList.get("origin") ?? "http://localhost:3004";

  return NextResponse.redirect(`${origin}/`, { status: 302 });
}
