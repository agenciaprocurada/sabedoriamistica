import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DreamForm } from "../DreamForm";

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
    <div className="max-w-xl mx-auto py-12 px-4 space-y-8">
      {/* Badge */}
      <div className="flex justify-center">
        <span className="font-body text-xs uppercase tracking-widest text-gold border border-gold/40 rounded-full px-4 py-1.5">
          Interpretação Gratuita
        </span>
      </div>

      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary leading-tight">
          Descubra o que o{" "}
          <span className="text-gold">Universo</span>{" "}
          está Tentando lhe Dizer
        </h1>
        <p className="font-body text-text-secondary leading-relaxed text-sm md:text-base">
          Nosso sistema analisa os símbolos e padrões do seu sonho para revelar
          mensagens que seu inconsciente está tentando comunicar.
        </p>
      </div>

      {/* Form */}
      <DreamForm />
    </div>
  );
}
