"use client";

import { useEffect, useState } from "react";

export function SessionToast() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-mystic-elevated border border-gold-subtle rounded-2xl px-5 py-3 shadow-gold flex items-center gap-3">
        <span className="text-gold text-lg">✨</span>
        <p className="font-body text-sm text-text-primary whitespace-nowrap">
          Acesso liberado! Aqui está sua interpretação completa ✨
        </p>
        <button
          onClick={() => setVisible(false)}
          className="text-text-muted hover:text-text-secondary transition-colors ml-2 text-xs"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
