"use client";

import { motion } from "framer-motion";
import type { TaroCard, Purpose } from "@/data/taro";

const PURPOSE_LABEL: Record<Purpose, string> = {
  general: "Geral",
  love: "Amor",
  work: "Trabalho",
  spiritual: "Espiritual",
};

const PURPOSE_THEME: Record<Purpose, string> = {
  general: "os caminhos da sua vida",
  love: "o seu coração e seus vínculos",
  work: "sua trajetória profissional",
  spiritual: "sua jornada interior",
};

interface Props {
  userName: string;
  purpose: Purpose;
  past: TaroCard;
  present: TaroCard;
  future: TaroCard;
  onNewReading: () => void;
  onChangePurpose: () => void;
}

function CardBlock({
  card,
  position,
  purpose,
  delay,
}: {
  card: TaroCard;
  position: string;
  purpose: Purpose;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-mystic-elevated rounded-2xl border border-gold-subtle overflow-hidden"
    >
      <div className="flex gap-4 p-4 items-start">
        <div className="flex-shrink-0 w-16 rounded-lg overflow-hidden border border-gold/30 shadow-lg">
          <img src={card.image} alt={card.name} className="w-full object-cover" />
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-body text-xs text-gold/70 uppercase tracking-widest">{position}</span>
          </div>
          <p className="font-display text-lg font-bold text-gold leading-tight">{card.name}</p>
          <p className="font-body text-xs text-text-muted">{card.meanings[purpose]}</p>
        </div>
      </div>
    </motion.div>
  );
}

function buildNarrative(
  name: string,
  purpose: Purpose,
  past: TaroCard,
  present: TaroCard,
  future: TaroCard
): string {
  const theme = PURPOSE_THEME[purpose];
  return `${name}, as cartas escolhidas revelam com clareza ${theme}. ` +
    `No passado, ${past.positions.past.toLowerCase()} ` +
    `${past.meanings[purpose]} ` +
    `Esta energia moldou quem você é hoje e o caminho que percorreu até aqui. ` +
    `No presente, o momento pede atenção: ${present.positions.present.toLowerCase()} ` +
    `${present.meanings[purpose]} ` +
    `É aqui que sua força está concentrada agora. ` +
    `Quanto ao futuro, as cartas apontam que ${future.positions.future.toLowerCase()} ` +
    `${future.meanings[purpose]} ` +
    `As cartas traçaram seu caminho — o que você faz com essa revelação é a sua escolha.`;
}

export function ReadingResult({ userName, purpose, past, present, future, onNewReading, onChangePurpose }: Props) {
  const narrative = buildNarrative(userName, purpose, past, present, future);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold text-gold">
          {userName}, sua leitura de {PURPOSE_LABEL[purpose]}
        </h2>
        <p className="font-body text-text-muted text-sm">As cartas revelam seu caminho</p>
      </motion.div>

      {/* Cartas em destaque */}
      <motion.div
        className="grid grid-cols-3 gap-2 sm:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {[
          { card: past, label: "Passado" },
          { card: present, label: "Presente" },
          { card: future, label: "Futuro" },
        ].map(({ card, label }, i) => (
          <motion.div
            key={card.id}
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
          >
            <p className="font-body text-xs text-gold/70 uppercase tracking-widest">{label}</p>
            <div className="w-full rounded-xl overflow-hidden border-2 border-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <img src={card.image} alt={card.name} className="w-full object-cover" />
            </div>
            <p className="font-display text-xs sm:text-sm text-gold text-center leading-tight">{card.name}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Interpretação por carta */}
      <div className="space-y-3">
        <motion.p
          className="font-display text-lg text-gold text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Interpretação Completa
        </motion.p>
        <CardBlock card={past}    position="Passado"  purpose={purpose} delay={0.8} />
        <CardBlock card={present} position="Presente" purpose={purpose} delay={0.95} />
        <CardBlock card={future}  position="Futuro"   purpose={purpose} delay={1.1} />
      </div>

      {/* Narrativa */}
      <motion.div
        className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-6 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-gold text-sm">✦</span>
          <p className="font-body text-xs uppercase tracking-widest text-text-muted">Síntese da Leitura</p>
        </div>
        <p className="font-body text-text-primary leading-relaxed text-sm">{narrative}</p>
      </motion.div>

      {/* Ações */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <button
          onClick={onNewReading}
          className="flex-1 bg-gold hover:bg-gold-light text-mystic-bg font-body font-semibold py-3 rounded-full transition-colors"
        >
          ✦ Nova Leitura
        </button>
        <button
          onClick={onChangePurpose}
          className="flex-1 border border-gold-subtle text-gold hover:bg-gold/5 font-body text-sm py-3 rounded-full transition-colors"
        >
          Mudar Propósito
        </button>
      </motion.div>
    </div>
  );
}
