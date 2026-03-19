"use client";

import { useState } from "react";

export function CheckoutButton({ dreamId }: { dreamId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/pagamentos/criar-cobranca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dreamId }),
      });
      const data = await res.json();

      if (res.ok && data.billingUrl) {
        window.location.href = data.billingUrl;
        return;
      }

      if (res.status === 422 && data.redirect) {
        window.location.href = `${data.redirect}?next=/sonhos/checkout/${dreamId}`;
        return;
      }

      setError(data.error || "Não foi possível iniciar o pagamento.");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="block w-full text-center font-body font-semibold text-lg bg-gold hover:bg-gold-light disabled:opacity-70 text-mystic-bg px-8 py-4 rounded-full shadow-gold hover:shadow-gold-lg transition-all duration-200"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-mystic-bg/40 border-t-mystic-bg animate-spin" />
            Preparando pagamento...
          </span>
        ) : (
          "✨ DESBLOQUEAR INTERPRETAÇÃO COMPLETA"
        )}
      </button>
      {error && (
        <p className="font-body text-xs text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
