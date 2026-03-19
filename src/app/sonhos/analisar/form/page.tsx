import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DreamForm } from "../DreamForm";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "Interpretar Meu Sonho | Sabedoria Mística",
  description: "Descreva seu sonho e receba uma interpretação profunda.",
};

export default async function FormPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/sonhos/analisar/form");
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gold">
          Conte Seu Sonho
        </h1>
        <p className="font-body text-text-secondary leading-relaxed">
          Descreva seu sonho e receba uma interpretação profunda.
        </p>
      </div>
      <AuthGuard>
        <DreamForm />
      </AuthGuard>
    </div>
  );
}
