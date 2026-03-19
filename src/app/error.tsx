"use client";

import { useEffect } from "react";

export default function Error({
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
      <p className="font-display text-2xl text-gold">Algo deu errado</p>
      <p className="font-body text-text-secondary max-w-sm">
        {error.message || "Ocorreu um erro inesperado. Tente novamente."}
      </p>
      <button
        onClick={reset}
        className="font-body text-sm bg-gold hover:bg-gold-light text-mystic-bg font-semibold px-6 py-2 rounded-full transition-colors duration-200"
      >
        Tentar novamente
      </button>
    </div>
  );
}
