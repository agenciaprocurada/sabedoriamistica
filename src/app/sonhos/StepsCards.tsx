"use client";

import { Card } from "@/components/ui";

const steps = [
  {
    emoji: "🌙",
    title: "Descreva seu sonho",
    description: "Conte com o máximo de detalhes tudo que você viveu enquanto dormia.",
  },
  {
    emoji: "🔮",
    title: "Interpretação profunda",
    description:
      "Especialistas em simbologia e sabedoria ancestral analisam cada detalhe, símbolo e emoção presente no seu sonho.",
  },
  {
    emoji: "✨",
    title: "Receba sua análise",
    description:
      "Descubra as mensagens ocultas, arquétipos e orientações que seu inconsciente está revelando para sua vida.",
  },
];

function scrollToTop() {
  document.getElementById("hero-form")?.scrollIntoView({ behavior: "smooth" });
}

export function StepsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {steps.map((step, i) => (
        <button
          key={i}
          type="button"
          onClick={scrollToTop}
          className="block text-left w-full bg-transparent border-0 p-0 cursor-pointer"
        >
          <Card hover className="relative flex flex-col gap-4 h-full">
            {/* Número do passo */}
            <span
              className="absolute -top-3 -left-3 h-7 w-7 rounded-full bg-gold text-mystic-bg font-body font-bold text-xs flex items-center justify-center shadow-gold"
            >
              {i + 1}
            </span>

            <span className="text-4xl">{step.emoji}</span>

            <h3 className="font-display text-xl font-semibold text-gold">
              {step.title}
            </h3>

            <p className="font-body text-text-secondary text-sm leading-relaxed">
              {step.description}
            </p>
          </Card>
        </button>
      ))}
    </div>
  );
}
