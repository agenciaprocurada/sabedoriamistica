"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MAX_POLLS = 40;
const POLL_INTERVAL = 3000;

const MESSAGES = [
  "Consultando nossas bases de sonho...",
  "Decifrando os símbolos ocultos...",
  "Gerando a interpretação completa...",
  "Conectando com os arquétipos universais...",
  "Análise sendo revisada por especialistas...",
  "Explorando as camadas do inconsciente...",
  "Montando a análise completa...",
  "Cruzando referências simbólicas...",
  "Formatando a análise...",
  "Últimos ajustes na sua interpretação...",
];

// Duração estimada total em ms (usada só para a barra visual)
const ESTIMATED_DURATION = 30_000;

export function PollingFallback({ dreamId }: { dreamId: string }) {
  const router = useRouter();
  const pollCount = useRef(0);
  const startTime = useRef(Date.now());
  const [timedOut, setTimedOut] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Avança a mensagem a cada ~4s
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Atualiza a barra de progresso a cada 500ms (caps em 92% para não chegar a 100% antes de terminar)
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const raw = elapsed / ESTIMATED_DURATION;
      // Curva logarítmica: sobe rápido no início, desacelera
      const capped = Math.min(0.92, 1 - Math.exp(-2.5 * raw));
      setProgress(Math.round(capped * 100));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Polling Supabase
  useEffect(() => {
    const supabase = createClient();

    const poll = async () => {
      pollCount.current += 1;

      const { data: dream } = await supabase
        .from("dreams")
        .select("paid_analysis, is_paid")
        .eq("id", dreamId)
        .single();

      if (dream?.paid_analysis && dream?.is_paid) {
        setProgress(100);
        setTimeout(() => router.refresh(), 400);
        return;
      }

      if (pollCount.current >= MAX_POLLS) {
        setTimedOut(true);
        return;
      }

      setTimeout(poll, POLL_INTERVAL);
    };

    poll();
  }, [dreamId, router]);

  if (timedOut) {
    return (
      <div className="max-w-md mx-auto py-16 flex flex-col items-center gap-6 text-center">
        <p className="font-display text-xl text-gold">
          Sua interpretação está sendo finalizada
        </p>
        <p className="font-body text-text-secondary text-sm max-w-xs">
          O processamento está demorando um pouco mais. Tente novamente em alguns instantes.
        </p>
        <button
          onClick={() => {
            pollCount.current = 0;
            startTime.current = Date.now();
            setTimedOut(false);
            setProgress(0);
          }}
          className="font-body text-sm bg-gold hover:bg-gold-light text-mystic-bg px-6 py-3 rounded-full transition-colors"
        >
          Verificar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto py-20 flex flex-col items-center gap-8 text-center px-6">

      {/* Ícone animado */}
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Anel externo girando */}
        <span className="absolute inset-0 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
        {/* Anel interno girando ao contrário */}
        <span className="absolute inset-2 rounded-full border border-gold/30 border-b-gold/60"
          style={{ animation: "spin 2s linear infinite reverse" }} />
        {/* Símbolo central */}
        <span className="text-gold text-2xl select-none">✦</span>
      </div>

      {/* Mensagem rotativa */}
      <div className="min-h-[3rem] flex items-center justify-center">
        <p
          key={msgIndex}
          className="font-display text-lg text-gold animate-fadeIn"
        >
          {MESSAGES[msgIndex]}
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="w-full space-y-2">
        <div className="w-full h-1.5 bg-gold/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="font-body text-xs text-text-muted">{progress}%</p>
      </div>

      <p className="font-body text-text-secondary text-sm max-w-xs">
        Nossos especialistas estão consultando as bibliotecas de símbolos e arquétipos para preparar sua análise única.
      </p>
    </div>
  );
}
