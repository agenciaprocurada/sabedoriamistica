import type { Metadata } from "next";
import { Suspense } from "react";
import { SIGNOS_INFO, SIGNOS_ORDER, type Signo } from "@/data/horoscopo";
import { getHoroscopoDiario } from "@/lib/horoscopo";
import { SignGrid } from "./SignGrid";

export const metadata: Metadata = {
  title: "Horóscopo Diário | Sabedoria Mística",
  description: "Descubra o que os astros reservam para você hoje. Horóscopo diário para todos os signos — amor, trabalho e energia.",
};

const CATEGORY_CONFIG = {
  amor:     { label: "Amor",     icon: "💖" },
  trabalho: { label: "Trabalho", icon: "💼" },
  energia:  { label: "Energia",  icon: "✨" },
} as const;

interface Props {
  searchParams: { signo?: string };
}

export default function HoroscopoDiarioPage({ searchParams }: Props) {
  const today = new Date();
  const dateFormatted = today.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const signoParam = searchParams.signo as Signo | undefined;
  const signoValido = signoParam && SIGNOS_ORDER.includes(signoParam) ? signoParam : null;
  const horoscopo = signoValido ? getHoroscopoDiario(signoValido, today) : null;
  const signoInfo = signoValido ? SIGNOS_INFO[signoValido] : null;

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gold">
          🔮 Horóscopo Diário
        </h1>
        <p className="font-body text-text-muted text-sm capitalize">{dateFormatted}</p>
      </div>

      {/* Seletor de signo */}
      <div className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-6 space-y-4">
        <p className="font-body text-sm text-text-secondary text-center">
          Escolha seu signo para ver a mensagem de hoje
        </p>
        <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-mystic-bg" />}>
          <SignGrid />
        </Suspense>
      </div>

      {/* Resultado do signo selecionado */}
      {signoValido && horoscopo && signoInfo && (
        <div className="space-y-4">
          {/* Cabeçalho do signo */}
          <div className="text-center space-y-1">
            <p className="text-5xl">{signoInfo.simbolo}</p>
            <h2 className="font-display text-2xl font-bold text-gold">{signoInfo.nome}</h2>
            <p className="font-body text-xs text-text-muted">{signoInfo.periodo}</p>
          </div>

          {/* Cards das categorias */}
          {(["amor", "trabalho", "energia"] as const).map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            return (
              <div
                key={cat}
                className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-6 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cfg.icon}</span>
                  <h3 className="font-display text-lg font-semibold text-gold">{cfg.label}</h3>
                </div>
                <p className="font-body text-text-primary leading-relaxed">
                  {horoscopo[cat]}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Estado vazio — nenhum signo selecionado */}
      {!signoValido && (
        <div className="text-center py-6 space-y-2">
          <p className="text-4xl">🌙</p>
          <p className="font-body text-text-secondary text-sm">
            Selecione seu signo acima para ver a mensagem dos astros para hoje.
          </p>
        </div>
      )}

    </div>
  );
}
