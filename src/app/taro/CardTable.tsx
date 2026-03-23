"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CARD_BACK, type TaroCard } from "@/data/taro";

const POSITIONS = ["Passado", "Presente", "Futuro"] as const;
type Position = (typeof POSITIONS)[number];

interface SelectedCards {
  past: TaroCard | null;
  present: TaroCard | null;
  future: TaroCard | null;
}

interface Props {
  userName: string;
  purposeLabel: string;
  deck: TaroCard[];
  onComplete: (cards: SelectedCards) => void;
  onBack: () => void;
  onReshuffle: () => void;
}

// Individual flippable card
function FlipCard({
  card,
  onSelect,
  disabled,
  isUsed,
}: {
  card: TaroCard;
  onSelect: (card: TaroCard) => void;
  disabled: boolean;
  isUsed: boolean;
}) {
  const [phase, setPhase] = useState<"back" | "flipping" | "done">("back");

  async function handleClick() {
    if (disabled || phase !== "back" || isUsed) return;
    setPhase("flipping");
    setTimeout(() => {
      setPhase("done");
      setTimeout(() => onSelect(card), 300);
    }, 700);
  }

  if (isUsed) {
    return <div className="aspect-[2/3] rounded-lg bg-mystic-bg/30 border border-gold/10 opacity-20" />;
  }

  return (
    <div
      className="aspect-[2/3] relative cursor-pointer select-none"
      style={{ perspective: "600px" }}
      onClick={handleClick}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ rotateY: phase === "done" ? 180 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Verso */}
        <motion.div
          className="absolute inset-0 rounded-lg overflow-hidden border border-gold/20"
          style={{ backfaceVisibility: "hidden" }}
          whileHover={phase === "back" && !disabled ? { scale: 1.06, boxShadow: "0 0 12px rgba(212,175,55,0.35)" } : {}}
        >
          <img src={CARD_BACK} alt="carta" className="w-full h-full object-cover" />
        </motion.div>

        {/* Face */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden border border-gold/40"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
        </div>
      </motion.div>
    </div>
  );
}

// Slot no topo
function Slot({ label, card }: { label: Position; card: TaroCard | null }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <p className="font-body text-xs uppercase tracking-widest text-gold/70">{label}</p>
      <div className="relative aspect-[2/3] w-16 sm:w-20 md:w-24 rounded-lg overflow-hidden border-2 border-dashed border-gold/30 bg-mystic-bg/40">
        <AnimatePresence>
          {card ? (
            <motion.img
              key={card.id}
              src={card.image}
              alt={card.name}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "backOut" }}
            />
          ) : (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-gold/25 text-2xl">✦</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {card && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-xs text-gold text-center leading-tight max-w-[5rem]"
        >
          {card.name}
        </motion.p>
      )}
    </div>
  );
}

export function CardTable({ userName, purposeLabel, deck, onComplete, onBack, onReshuffle }: Props) {
  const [selected, setSelected] = useState<SelectedCards>({ past: null, present: null, future: null });
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());
  const [shuffling, setShuffling] = useState(true);

  const step = selected.past === null ? 0 : selected.present === null ? 1 : selected.future === null ? 2 : 3;
  const instructions = [
    `Escolha a carta do **Passado**, ${userName}`,
    `Agora escolha a carta do **Presente**`,
    `Por fim, escolha a carta do **Futuro**`,
    "As cartas foram escolhidas...",
  ];

  // Shuffling intro
  useEffect(() => {
    const t = setTimeout(() => setShuffling(false), 2200);
    return () => clearTimeout(t);
  }, []);

  // Trigger completion
  useEffect(() => {
    if (selected.past && selected.present && selected.future) {
      setTimeout(() => onComplete(selected), 600);
    }
  }, [selected, onComplete]);

  function handleSelect(card: TaroCard) {
    setUsedIds((prev) => { const next = new Set(prev); next.add(card.id); return next; });
    setSelected((prev) => {
      if (!prev.past) return { ...prev, past: card };
      if (!prev.present) return { ...prev, present: card };
      if (!prev.future) return { ...prev, future: card };
      return prev;
    });
  }

  if (shuffling) {
    return (
      <motion.div
        className="min-h-[50vh] flex flex-col items-center justify-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-5xl"
        >
          🔮
        </motion.div>
        <div className="text-center space-y-2">
          <motion.p
            className="font-display text-xl text-gold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Embaralhando as cartas para {userName}...
          </motion.p>
          <p className="font-body text-text-muted text-sm">Os arcanos se preparam para revelar seu caminho</p>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gold"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-body text-xs text-text-muted hover:text-gold transition-colors"
        >
          ← Voltar
        </button>
        <p className="font-display text-sm text-gold text-center">Consulta de Tarô: {purposeLabel}</p>
        <button
          onClick={onReshuffle}
          className="flex items-center gap-1.5 font-body text-xs text-text-muted hover:text-gold transition-colors"
        >
          ⇄ Embaralhar
        </button>
      </div>

      {/* Slots */}
      <div className="flex justify-center gap-4 sm:gap-8 py-2">
        <Slot label="Passado" card={selected.past} />
        <Slot label="Presente" card={selected.present} />
        <Slot label="Futuro" card={selected.future} />
      </div>

      {/* Instrução */}
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          className="font-body text-sm text-text-secondary text-center"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          dangerouslySetInnerHTML={{
            __html: instructions[step].replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold">$1</strong>'),
          }}
        />
      </AnimatePresence>

      {/* Grid de cartas */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2">
        {deck.map((card) => (
          <FlipCard
            key={card.id}
            card={card}
            onSelect={handleSelect}
            disabled={step === 3}
            isUsed={usedIds.has(card.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}
