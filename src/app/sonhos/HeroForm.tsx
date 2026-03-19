"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MysticLoader } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

const LOADING_MESSAGES = [
  "Consultando o dicionário de sonhos...",
  "Identificando os símbolos do seu sonho...",
  "Analisando emoções e padrões ocultos...",
  "Conectando os elementos do sonho...",
  "Preparando sua interpretação personalizada...",
];

function AnalysisLoader() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    // Barra de progresso avança suavemente até ~90% e para
    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + 1.2;
      });
    }, 80);

    return () => clearInterval(progressTimer);
  }, []);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
        setFade(true);
      }, 300);
    }, 2200);

    return () => clearInterval(msgTimer);
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-8 py-4 animate-fadeIn">
      <MysticLoader size={64} text="" />

      <div className="w-full space-y-3">
        {/* Barra de progresso */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Mensagem rotativa */}
        <p
          className="font-body text-sm text-center text-text-secondary transition-opacity duration-300"
          style={{ opacity: fade ? 1 : 0 }}
        >
          {LOADING_MESSAGES[msgIndex]}
        </p>
      </div>

      <div className="text-center space-y-1">
        <p className="font-display text-xl text-gold">
          Seu sonho está sendo analisado
        </p>
        <p className="font-body text-xs text-text-muted">
          Isso leva apenas alguns segundos
        </p>
      </div>
    </div>
  );
}

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
      router.push("/sonhos/analisar");
    } else {
      await new Promise((r) => setTimeout(r, 2000));
      router.push("/login?redirect=/sonhos/analisar");
    }
  }

  if (loading) {
    return <AnalysisLoader />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto relative"
    >
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-5">
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
          className="w-full bg-black/20 border border-white/10 rounded-xl p-4 font-body text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-gold/50 transition-colors"
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
