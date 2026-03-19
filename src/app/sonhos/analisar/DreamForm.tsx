"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MysticLoader } from "@/components/ui/MysticLoader";

const LOADING_MESSAGES = [
  "Interpretando seu sonho...",
  "Decodificando os símbolos...",
  "Analisando padrões do inconsciente...",
  "Revelando as mensagens ocultas...",
];

export function DreamForm() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(
    async (text: string) => {
      if (text.trim().length < 20) {
        setError("Descreva seu sonho com pelo menos 20 caracteres.");
        return;
      }

      setLoading(true);
      setError(null);

      let msgIndex = 0;
      const msgInterval = setInterval(() => {
        msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMsg(LOADING_MESSAGES[msgIndex]);
      }, 3500);

      try {
        const res = await fetch("/api/sonhos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: text }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Algo deu errado. Tente novamente.");
          return;
        }

        router.push(`/sonhos/resultado/${data.dreamId}`);
      } catch {
        setError("Erro de conexão. Verifique sua internet e tente novamente.");
      } finally {
        clearInterval(msgInterval);
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    const pending = sessionStorage.getItem("pendingDream");
    if (pending) {
      sessionStorage.removeItem("pendingDream");
      setDescription(pending);
      analyze(pending);
    }
  }, [analyze]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await analyze(description);
  }

  if (loading) {
    return (
      <div className="bg-mystic-card border border-gold-subtle rounded-2xl p-8 flex flex-col items-center gap-6">
        <MysticLoader text={loadingMsg} size={56} />
        <p className="font-body text-text-muted text-sm text-center max-w-xs">
          A interpretação profunda leva alguns momentos. Aguarde com calma.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
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
          placeholder="Escreva tudo que você se lembra: o ambiente, as pessoas, os objetos, as emoções, as cores, os eventos..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full min-h-[180px] bg-mystic-input border border-gold-subtle rounded-xl p-4 font-body text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-gold/50 transition-colors"
          required
        />

        {error && (
          <p className="font-body text-sm text-center px-3 py-2 rounded-lg bg-gold-subtle text-gold border border-gold/20">
            {error}
          </p>
        )}

        {/* Footer row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1 border-t border-gold-subtle">
          <p className="font-body text-text-muted text-xs text-center sm:text-left">
            100% gratuito&nbsp;•&nbsp;Resultado instantâneo&nbsp;•&nbsp;Interpretação personalizada
          </p>
          <button
            type="submit"
            className="shrink-0 font-body text-sm font-semibold bg-gold hover:bg-gold-light text-mystic-bg px-6 py-3 rounded-full transition-colors whitespace-nowrap"
          >
            ✦ Interpretar Sonho Grátis
          </button>
        </div>
      </div>
    </form>
  );
}
