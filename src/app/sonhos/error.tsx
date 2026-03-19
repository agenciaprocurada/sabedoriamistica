"use client";

import { useEffect } from "react";

export default function SonhosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4">
      <p className="text-4xl">🌙</p>
      <div className="space-y-2">
        <h2 className="font-display text-2xl text-gold">
          Algo interferiu na interpretação
        </h2>
        <p className="font-body text-text-secondary max-w-sm">
          Não foi possível interpretar seu sonho neste momento. Tente novamente em instantes.
        </p>
      </div>
      <button
        onClick={reset}
        className="font-body text-sm bg-gold hover:bg-gold-light text-mystic-bg font-semibold px-6 py-3 rounded-full transition-colors duration-200"
      >
        Tentar novamente
      </button>
      <a href="/sonhos" className="font-body text-xs text-text-muted hover:text-text-secondary transition-colors">
        Voltar ao portal
      </a>
    </div>
  );
}
