"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SIGNOS_ORDER, SIGNOS_INFO, type Signo } from "@/data/horoscopo";
import type { HoroscopoDiario } from "@/lib/horoscopo";

interface Props {
  todayData: Record<Signo, HoroscopoDiario>;
}

const CATEGORY_CONFIG = [
  { key: "amor" as const,     label: "Amor",     icon: "💖", color: "from-rose-500/10",   border: "border-rose-500/20"   },
  { key: "trabalho" as const, label: "Trabalho", icon: "💼", color: "from-amber-500/10",  border: "border-amber-500/20"  },
  { key: "energia" as const,  label: "Energia",  icon: "⚡", color: "from-violet-500/10", border: "border-violet-500/20" },
] as const;

export function HomeHoroscopo({ todayData }: Props) {
  const [selected, setSelected] = useState<Signo | null>(null);
  const [visible, setVisible] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  function selectSigno(signo: Signo) {
    if (signo === selected) return;
    setVisible(false);
    setTimeout(() => {
      setSelected(signo);
      setVisible(true);
    }, 150);
  }

  useEffect(() => {
    if (selected && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 250);
    }
  }, [selected]);

  const horoscopo = selected ? todayData[selected] : null;
  const signoInfo = selected ? SIGNOS_INFO[selected] : null;

  return (
    <div className="space-y-5">
      {/* Grid de signos */}
      <div className="grid grid-cols-6 gap-2">
        {SIGNOS_ORDER.map((signo) => {
          const info = SIGNOS_INFO[signo];
          const isActive = selected === signo;
          return (
            <button
              key={signo}
              onClick={() => selectSigno(signo)}
              className={`
                relative flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border
                transition-all duration-200 cursor-pointer
                ${isActive
                  ? "border-gold bg-gold/10 shadow-[0_0_14px_rgba(212,175,55,0.2)] scale-105"
                  : "border-gold-subtle bg-mystic-elevated hover:border-gold/40 hover:bg-gold/5"
                }
              `}
            >
              <span className={`text-xl leading-none transition-all duration-200 ${isActive ? "drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]" : ""}`}>
                {info.simbolo}
              </span>
              <span className={`font-display text-[10px] font-semibold leading-tight text-center ${isActive ? "text-gold" : "text-text-secondary"}`}>
                {info.nome}
              </span>
              {isActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold" />
              )}
            </button>
          );
        })}
      </div>

      {/* Prompt vazio */}
      {!selected && (
        <div className="text-center py-4 space-y-2">
          <p className="font-body text-text-muted text-sm">
            Toque no seu signo para revelar a mensagem de hoje
          </p>
        </div>
      )}

      {/* Resultado compacto */}
      {selected && horoscopo && signoInfo && (
        <div
          ref={resultRef}
          className={`space-y-3 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
        >
          <div className="flex items-center gap-3 px-1">
            <span className="text-2xl drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">{signoInfo.simbolo}</span>
            <div>
              <p className="font-display text-base font-bold text-gold leading-tight">{signoInfo.nome}</p>
              <p className="font-body text-xs text-text-muted">{signoInfo.periodo}</p>
            </div>
          </div>

          <div className="grid gap-2">
            {CATEGORY_CONFIG.map(({ key, label, icon, color, border }) => (
              <div
                key={key}
                className={`relative bg-gradient-to-r ${color} to-transparent bg-mystic-elevated rounded-xl border ${border} px-4 py-3 flex items-start gap-3`}
              >
                <span className="text-lg shrink-0 mt-0.5">{icon}</span>
                <div>
                  <p className="font-display text-xs font-semibold text-text-primary mb-1">{label}</p>
                  <p className="font-body text-xs text-text-secondary leading-relaxed">{horoscopo[key]}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              href={`/horoscopo-diario?signo=${selected}`}
              className="font-body text-xs text-gold hover:underline"
            >
              Ler horóscopo completo →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
