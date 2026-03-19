import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AutoAnalyze } from "./AutoAnalyze";

export const metadata: Metadata = {
  title: "Analisando seu Sonho | Sabedoria Mística",
  description: "Sua interpretação está sendo preparada.",
};

export default async function AnalisarPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/sonhos/analisar");
  }

  return (
    <div className="max-w-2xl mx-auto py-16">
      <AutoAnalyze />
    </div>
  );
}
