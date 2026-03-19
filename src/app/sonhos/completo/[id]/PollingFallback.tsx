"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MysticLoader } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

const MAX_POLLS = 20;
const POLL_INTERVAL = 3000;

export function PollingFallback({ dreamId }: { dreamId: string }) {
  const router = useRouter();
  const pollCount = useRef(0);
  const [timedOut, setTimedOut] = useState(false);

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
        router.refresh();
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
            setTimedOut(false);
          }}
          className="font-body text-sm bg-gold hover:bg-gold-light text-mystic-bg px-6 py-3 rounded-full transition-colors"
        >
          Verificar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16 flex flex-col items-center gap-6 text-center">
      <MysticLoader size={64} text="" />
      <p className="font-display text-xl text-gold animate-pulse">
        Revelando sua interpretação completa...
      </p>
      <p className="font-body text-text-secondary text-sm max-w-xs">
        Estamos preparando cada detalhe do seu sonho. Isso leva apenas alguns instantes.
      </p>
    </div>
  );
}
