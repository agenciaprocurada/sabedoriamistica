"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Purpose } from "@/data/taro";

const PURPOSES: { key: Purpose; label: string; icon: string; desc: string }[] = [
  { key: "general",   label: "Geral",      icon: "✦",  desc: "Orientação geral sobre sua vida" },
  { key: "love",      label: "Amor",       icon: "♡",  desc: "Relacionamentos e vida amorosa" },
  { key: "work",      label: "Trabalho",   icon: "⚡", desc: "Carreira e finanças" },
  { key: "spiritual", label: "Espiritual", icon: "☽",  desc: "Crescimento e jornada interior" },
];

interface Props {
  onStart: (name: string, purpose: Purpose) => void;
}

export function PurposeStep({ onStart }: Props) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState<Purpose | null>(null);

  const canStart = name.trim().length >= 2 && purpose !== null;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        className="text-center space-y-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-5xl mb-2">🔮</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gold">
          Jogo de Tarô
        </h1>
        <p className="font-body text-text-secondary text-sm max-w-sm mx-auto">
          As cartas revelam o que as palavras não alcançam. Prepare-se para sua consulta.
        </p>
      </motion.div>

      {/* Nome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome..."
          maxLength={40}
          className="w-full bg-mystic-elevated border border-gold-subtle rounded-xl px-5 py-3.5 font-body text-text-primary placeholder:text-text-muted text-center text-lg focus:outline-none focus:border-gold transition-colors"
        />
      </motion.div>

      {/* Propósito */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <p className="font-display text-center text-xl text-text-primary">
          Qual o propósito da sua consulta?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {PURPOSES.map(({ key, label, icon, desc }, i) => {
            const active = purpose === key;
            return (
              <motion.button
                key={key}
                onClick={() => setPurpose(key)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200
                  ${active
                    ? "border-gold bg-gold/10 shadow-[0_0_16px_rgba(212,175,55,0.2)]"
                    : "border-gold-subtle bg-mystic-elevated hover:border-gold/40"
                  }
                `}
              >
                <span className={`text-xl mt-0.5 ${active ? "text-gold" : "text-text-muted"}`}>{icon}</span>
                <div>
                  <p className={`font-display font-semibold text-sm ${active ? "text-gold" : "text-text-primary"}`}>
                    {label}
                  </p>
                  <p className="font-body text-xs text-text-muted leading-tight mt-0.5">{desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Botão */}
      <motion.button
        onClick={() => canStart && onStart(name.trim(), purpose!)}
        disabled={!canStart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={canStart ? { scale: 1.02 } : {}}
        whileTap={canStart ? { scale: 0.98 } : {}}
        className="w-full bg-gold hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed text-mystic-bg font-body font-semibold text-lg py-4 rounded-full shadow-gold transition-all duration-200"
      >
        ✦ Iniciar Consulta
      </motion.button>
    </div>
  );
}
