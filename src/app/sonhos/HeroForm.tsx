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
      className="w-full max-w-xl mx-auto relative"
    >
      {/* Glow radial por trás do card */}
      <div
        className="absolute -inset-6 -z-10 blur-3xl opacity-50 rounded-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 60% 40%, #1E2E9A 0%, #141C52 50%, transparent 75%)" }}
      />
      <div className="bg-mystic-card border border-gold-subtle rounded-2xl p-6 space-y-5">
        {/* Card header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-gold text-lg leading-none">✦</span>
            <h2 className="font-display text-xl text-text-primary font-semibold">
              Descreva seu sonho com detalhes
            </h2>
          </div>
          <p className="font-body text-text-secondary text-sm pl-6">
            Quanto mais detalhes você incluir, mais precisa será a interpretação.
          </p>
        </div>

        {/* Textarea */}
        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="Escreva tudo que você se lembra: o ambiente, as pessoas, os objetos, as emoções, as cores, os eventos..."
          rows={5}
          className="w-full bg-mystic-input border border-gold-subtle rounded-xl p-4 font-body text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-gold/50 transition-colors"
        />

        {/* Footer row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1 border-t border-gold-subtle">
          <p className="font-body text-text-muted text-xs text-center sm:text-left">
            100% gratuito&nbsp;•&nbsp;Resultado instantâneo&nbsp;•&nbsp;Interpretação personalizada
          </p>
          <button
            type="submit"
            disabled={!dream.trim()}
            className="shrink-0 font-body text-sm font-semibold bg-gold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-mystic-bg px-6 py-3 rounded-full transition-colors whitespace-nowrap"
          >
            ✦ Interpretar Sonho Grátis
          </button>
        </div>
      </div>
    </form>
  );
}
