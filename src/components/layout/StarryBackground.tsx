"use client";

import { useEffect, useState } from "react";

interface Star {
  top: string;
  left: string;
  size: number;
  opacity: number;
  delay: string;
}

export function StarryBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generated: Star[] = Array.from({ length: 80 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() < 0.7 ? 1 : 2,
      opacity: 0.2 + Math.random() * 0.3,
      delay: `${(Math.random() * 4).toFixed(1)}s`,
    }));
    setStars(generated);
  }, []);

  if (stars.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animation: `twinkle 4s ease-in-out infinite`,
            animationDelay: star.delay,
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: var(--tw-opacity, 0.3); }
          50%       { opacity: 0.05; }
        }
      `}</style>
    </div>
  );
}
