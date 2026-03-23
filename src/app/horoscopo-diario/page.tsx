import type { Metadata } from "next";
import { Suspense } from "react";
import { SIGNOS_ORDER, type Signo } from "@/data/horoscopo";
import { getHoroscopoDiario, type HoroscopoDiario } from "@/lib/horoscopo";
import { HoroscopoView } from "./HoroscopoView";

export const metadata: Metadata = {
  title: "Horóscopo Diário | Sabedoria Mística",
  description: "Descubra o que os astros reservam para você hoje. Horóscopo diário para todos os signos — amor, trabalho e energia.",
};

interface Props {
  searchParams: { signo?: string };
}

export default function HoroscopoDiarioPage({ searchParams }: Props) {
  const today = new Date();

  const dateFormatted = today.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Pré-calcula todos os signos no servidor (sem custo, é só math)
  const todayData = Object.fromEntries(
    SIGNOS_ORDER.map((signo) => [signo, getHoroscopoDiario(signo, today)])
  ) as Record<Signo, HoroscopoDiario>;

  const signoParam = searchParams.signo as Signo | undefined;
  const initialSigno = signoParam && SIGNOS_ORDER.includes(signoParam) ? signoParam : undefined;

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">

      {/* Hero header */}
      <div className="text-center space-y-3">
        <div className="relative inline-block">
          <span className="absolute -top-3 -left-5 text-gold opacity-40 text-sm animate-pulse">✦</span>
          <span className="absolute -top-2 -right-4 text-gold opacity-30 text-xs animate-pulse" style={{ animationDelay: "0.6s" }}>✦</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gold">
            🔮 Horóscopo Diário
          </h1>
        </div>

        {/* Badge de data */}
        <div className="inline-flex items-center gap-2 bg-mystic-elevated border border-gold-subtle rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="font-body text-xs text-text-secondary capitalize">{dateFormatted}</span>
        </div>

        <p className="font-body text-text-muted text-sm max-w-sm mx-auto">
          Escolha seu signo e descubra o que os astros têm a dizer para você hoje
        </p>
      </div>

      {/* Container principal */}
      <div className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-5 sm:p-6">
        <Suspense fallback={
          <div className="space-y-4">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-mystic-bg animate-pulse" />
              ))}
            </div>
          </div>
        }>
          <HoroscopoView todayData={todayData} initialSigno={initialSigno} />
        </Suspense>
      </div>

    </div>
  );
}
