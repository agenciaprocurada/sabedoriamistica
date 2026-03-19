"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MysticLoader } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export function HeroForm() {
  const router = useRouter();
  const [dream, setDream] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dream.trim()) return;
    setLoading(true);

    sessionStorage.setItem("pendingDream", dream.trim());

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Já logado — vai direto para a análise
      router.push("/sonhos/analisar");
    } else {
      // Não logado — mostra loading e redireciona para login
      await new Promise((r) => setTimeout(r, 2000));
      router.push("/login?redirect=/sonhos/analisar");
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6 py-8 animate-fade-in">
        <MysticLoader size={72} text="" />
        <p className="font-display text-2xl text-gold text-center">
          Seu sonho está sendo analisado
        </p>
        <p className="font-body text-text-secondary text-center max-w-sm">
          Estamos preparando a interpretação profunda. Em instantes você receberá sua análise personalizada.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto flex flex-col gap-4"
    >
      <textarea
        value={dream}
        onChange={(e) => setDream(e.target.value)}
        placeholder="Descreva seu sonho com o máximo de detalhes… lugares, pessoas, emoções, cores…"
        rows={4}
        className="w-full rounded-2xl bg-mystic-elevated border border-gold-subtle focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none font-body text-text-primary placeholder:text-text-muted text-base px-5 py-4 transition-colors duration-200"
      />
      <button
        type="submit"
        disabled={!dream.trim()}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-mystic-bg font-body font-semibold text-lg px-10 py-4 shadow-gold hover:shadow-gold-lg transition-all duration-200"
      >
        ✨ Interpretar Sonho Grátis
      </button>
      <p className="font-body text-text-muted text-xs text-center">
        100% gratuito &nbsp;•&nbsp; Resultado instantâneo &nbsp;•&nbsp; Interpretação personalizada
      </p>
    </form>
  );
}
