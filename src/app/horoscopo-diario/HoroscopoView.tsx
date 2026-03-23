"use client";

import { useState, useEffect, useRef } from "react";
import { SIGNOS_ORDER, SIGNOS_INFO, type Signo } from "@/data/horoscopo";
import type { HoroscopoDiario } from "@/lib/horoscopo";

interface HoroscopoViewProps {
  todayData: Record<Signo, HoroscopoDiario>;
  initialSigno?: Signo;
}

const CATEGORY_CONFIG = [
  { key: "amor",     label: "Amor",     icon: "💖", color: "from-rose-500/10 to-transparent",    border: "border-rose-500/20"   },
  { key: "trabalho", label: "Trabalho", icon: "💼", color: "from-amber-500/10 to-transparent",   border: "border-amber-500/20"  },
  { key: "energia",  label: "Energia",  icon: "⚡", color: "from-violet-500/10 to-transparent",  border: "border-violet-500/20" },
] as const;

export function HoroscopoView({ todayData, initialSigno }: HoroscopoViewProps) {
  const [selected, setSelected] = useState<Signo | null>(initialSigno ?? null);
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
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [selected]);

  useEffect(() => {
    if (initialSigno) setVisible(true);
  }, [initialSigno]);

  const horoscopo = selected ? todayData[selected] : null;
  const signoInfo = selected ? SIGNOS_INFO[selected] : null;

  return (
    <div className="space-y-6">
      {/* Grid de signos */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
        {SIGNOS_ORDER.map((signo) => {
          const info = SIGNOS_INFO[signo];
          const isActive = selected === signo;
          return (
            <button
              key={signo}
              onClick={() => selectSigno(signo)}
              className={`
                relative flex flex-col items-center gap-1 py-3 px-1 rounded-xl border
                transition-all duration-200 cursor-pointer
                ${isActive
                  ? "border-gold bg-gold/10 shadow-[0_0_16px_rgba(212,175,55,0.25)] scale-105"
                  : "border-gold-subtle bg-mystic-elevated hover:border-gold/40 hover:bg-gold/5 hover:scale-102"
                }
              `}
            >
              <span
                className={`text-2xl sm:text-3xl leading-none transition-all duration-200 ${isActive ? "drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" : ""}`}
              >
                {info.simbolo}
              </span>
              <span className={`font-display text-xs font-semibold leading-tight text-center ${isActive ? "text-gold" : "text-text-secondary"}`}>
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
        <div className="text-center py-8 space-y-3 animate-fadeIn">
          <div className="flex justify-center gap-4 text-3xl opacity-40">
            <span>♈</span><span>♌</span><span>♐</span>
          </div>
          <p className="font-body text-text-muted text-sm">
            Toque no seu signo para revelar a mensagem de hoje
          </p>
        </div>
      )}

      {/* Resultado */}
      {selected && horoscopo && signoInfo && (
        <div
          ref={resultRef}
          className={`space-y-4 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {/* Hero do signo */}
          <div className="relative bg-mystic-elevated rounded-2xl border border-gold-subtle overflow-hidden">
            {/* Símbolo de fundo decorativo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="text-[8rem] opacity-[0.04] leading-none font-bold">{signoInfo.simbolo}</span>
            </div>

            <div className="relative z-10 p-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-gold/30 bg-gold/5 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                <span className="text-3xl">{signoInfo.simbolo}</span>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="font-display text-2xl font-bold text-gold">{signoInfo.nome}</h2>
                <p className="font-body text-xs text-text-muted">{signoInfo.periodo}</p>
                <p className="font-body text-xs text-text-muted mt-1">Previsão de hoje dos astros</p>
              </div>
            </div>
          </div>

          {/* Cards das categorias */}
          {CATEGORY_CONFIG.map(({ key, label, icon, color, border }) => (
            <div
              key={key}
              className={`relative bg-gradient-to-br ${color} bg-mystic-elevated rounded-2xl border ${border} p-5 space-y-3 overflow-hidden`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{icon}</span>
                <h3 className="font-display text-base font-semibold text-text-primary">{label}</h3>
              </div>
              <p className="font-body text-text-primary leading-relaxed text-sm">
                {horoscopo[key]}
              </p>
            </div>
          ))}

          {/* Rodapé do resultado */}
          <div className="text-center pt-2">
            <p className="font-body text-xs text-text-muted">
              ✦ Mensagem atualiza automaticamente amanhã ✦
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
