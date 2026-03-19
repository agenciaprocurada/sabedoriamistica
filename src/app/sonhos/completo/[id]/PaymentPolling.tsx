"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MysticLoader } from "@/components/ui";

const MAX_POLLS = 30; // 90 segundos
const POLL_INTERVAL = 3000;

export function PaymentPolling({ dreamId }: { dreamId: string }) {
  const router = useRouter();
  const pollCount = useRef(0);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const poll = async () => {
      pollCount.current += 1;

      try {
        const res = await fetch("/api/pagamentos/verificar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dreamId }),
        });
        const data = await res.json();

        if (data.isPaid) {
          router.refresh();
          return;
        }
      } catch {
        // ignora erro de rede e continua tentando
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
        <p className="text-4xl">⌛</p>
        <p className="font-display text-xl text-gold">
          Confirmando seu pagamento...
        </p>
        <p className="font-body text-text-secondary text-sm max-w-xs">
          O processamento está demorando mais do que o esperado. Se o pagamento foi confirmado, tente recarregar a página.
        </p>
        <button
          onClick={() => {
            pollCount.current = 0;
            setTimedOut(false);
          }}
          className="font-body text-sm bg-gold hover:bg-gold-light text-mystic-bg px-6 py-3 rounded-full transition-colors"
        >
          Verificar novamente
        </button>
        <a
          href={`/sonhos/resultado/${dreamId}`}
          className="font-body text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          Voltar à interpretação gratuita
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16 flex flex-col items-center gap-6 text-center">
      <MysticLoader size={64} text="" />
      <p className="font-display text-xl text-gold animate-pulse">
        Confirmando seu pagamento...
      </p>
      <p className="font-body text-text-secondary text-sm max-w-xs">
        Estamos verificando a confirmação do pagamento. Isso leva apenas alguns instantes.
      </p>
    </div>
  );
}
