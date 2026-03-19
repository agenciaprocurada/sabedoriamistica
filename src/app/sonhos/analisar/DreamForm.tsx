"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { MysticLoader } from "@/components/ui/MysticLoader";

const LOADING_MESSAGES = [
  "Interpretando seu sonho...",
  "Decodificando os símbolos...",
  "Atravessando os véus do inconsciente...",
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
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <MysticLoader text={loadingMsg} size={64} />
        <p className="font-body text-text-muted text-sm text-center max-w-xs">
          A interpretação profunda leva alguns momentos. Aguarde com calma.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Textarea
        label="Descreva seu sonho"
        placeholder="Escreva tudo que você se lembra: o ambiente, as pessoas, os objetos, as emoções, as cores, os eventos... Quanto mais detalhes, mais profunda será a interpretação."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        charCount
        maxLength={2000}
        className="min-h-[200px]"
        required
      />

      <div className="bg-mystic-elevated rounded-xl px-4 py-3 flex items-start gap-3">
        <span className="text-lg mt-0.5">💡</span>
        <p className="font-body text-text-muted text-sm leading-relaxed">
          <span className="text-text-secondary font-medium">Dica:</span> Inclua
          as emoções que sentiu durante o sonho, as cores predominantes e se
          havia pessoas conhecidas ou estranhas.
        </p>
      </div>

      {error && (
        <p className="font-body text-sm text-center px-3 py-2 rounded-lg bg-gold-subtle text-gold border border-gold/20">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" fullWidth size="lg">
        Revelar a Interpretação
      </Button>

      <p className="font-body text-text-muted text-xs text-center">
        ✨ Interpretação gratuita e personalizada
      </p>
    </form>
  );
}
