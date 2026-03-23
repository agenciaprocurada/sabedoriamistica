"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SIGNOS_ORDER, SIGNOS_INFO, type Signo } from "@/data/horoscopo";

export function SignGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("signo") as Signo | null;

  function select(signo: Signo) {
    router.push(`/horoscopo-diario?signo=${signo}`);
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {SIGNOS_ORDER.map((signo) => {
        const info = SIGNOS_INFO[signo];
        const isActive = selected === signo;
        return (
          <button
            key={signo}
            onClick={() => select(signo)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${
              isActive
                ? "border-gold bg-gold/10 shadow-gold"
                : "border-gold-subtle bg-mystic-elevated hover:border-gold/40 hover:bg-gold/5"
            }`}
          >
            <span className="text-2xl leading-none">{info.simbolo}</span>
            <span className={`font-display text-sm font-semibold ${isActive ? "text-gold" : "text-text-primary"}`}>
              {info.nome}
            </span>
            <span className="font-body text-xs text-text-muted">{info.periodo}</span>
          </button>
        );
      })}
    </div>
  );
}
