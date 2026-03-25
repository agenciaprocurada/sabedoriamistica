"use client";

import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Mariana S.",
    location: "São Paulo, SP",
    text: "Sonhei repetidamente com água turva por semanas. A interpretação me ajudou a entender que estava evitando uma conversa difícil no trabalho. Depois da análise, tive coragem de agir.",
  },
  {
    name: "Ricardo O.",
    location: "Belo Horizonte, MG",
    text: "Fiquei impressionado com a profundidade da análise. Meu sonho sobre voar estava ligado a uma decisão que eu precisava tomar. A interpretação foi cirúrgica e muito precisa.",
  },
  {
    name: "Fernanda L.",
    location: "Curitiba, PR",
    text: "Uso toda semana. Os sonhos têm me guiado em momentos de dúvida. Sinto que finalmente entendo a linguagem que minha alma usa para falar comigo enquanto durmo.",
  },
];

const INTERVAL_MS = 5000;

function Stars() {
  return (
    <span className="text-gold text-base leading-none" aria-label="5 estrelas">
      ★★★★★
    </span>
  );
}

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      // Fade out
      setVisible(false);
      setTimeout(() => {
        setCurrent((i) => (i + 1) % testimonials.length);
        setVisible(true);
      }, 350);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  const t = testimonials[current];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card */}
      <div
        className="w-full max-w-xl mx-auto bg-mystic-elevated border border-gold-subtle rounded-2xl p-6 flex flex-col gap-4 transition-opacity duration-350"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <Stars />
        <p className="font-accent italic text-text-secondary text-base leading-relaxed">
          &ldquo;{t.text}&rdquo;
        </p>
        <div className="border-t border-gold-subtle pt-4">
          <p className="font-body text-text-primary text-sm font-medium">{t.name}</p>
          <p className="font-body text-text-muted text-xs">{t.location}</p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setVisible(false);
              setTimeout(() => { setCurrent(i); setVisible(true); }, 350);
            }}
            aria-label={`Depoimento ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-5 h-2 bg-gold"
                : "w-2 h-2 bg-gold/30 hover:bg-gold/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
