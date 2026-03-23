"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CheckoutBox({ dreamId }: { dreamId: string }) {
  const router = useRouter();
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function applyCoupon() {
    const code = couponCode.trim();
    if (!code) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/cupom/aplicar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dreamId, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Cupom inválido.");
        return;
      }

      router.push(`/sonhos/completo/${dreamId}`);
    } catch {
      setError("Erro ao aplicar cupom. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Preço */}
      <div className="text-center">
        <p className="font-body text-text-muted text-sm line-through">R$ 19,90</p>
        <p className="font-display text-4xl font-bold text-gold">R$ 9,90</p>
        <p className="font-body text-text-muted text-xs">pagamento único</p>
      </div>

      {/* Botão principal */}
      <button
        onClick={() => router.push(`/sonhos/checkout/${dreamId}`)}
        className="block w-full text-center font-body font-semibold text-lg bg-gold hover:bg-gold-light text-mystic-bg px-8 py-4 rounded-full shadow-gold hover:shadow-gold-lg transition-all duration-200"
      >
        ✨ DESBLOQUEAR INTERPRETAÇÃO COMPLETA
      </button>

      {/* Cupom */}
      {!showCoupon ? (
        <button
          onClick={() => setShowCoupon(true)}
          className="font-body text-xs text-text-muted hover:text-gold underline underline-offset-2 transition-colors"
        >
          Tenho um cupom
        </button>
      ) : (
        <div className="w-full flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Digite seu cupom"
              className="flex-1 bg-mystic-bg border border-gold-subtle rounded-full px-4 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold"
              onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
              disabled={loading}
            />
            <button
              onClick={applyCoupon}
              disabled={loading || !couponCode.trim()}
              className="bg-gold hover:bg-gold-light disabled:opacity-50 text-mystic-bg font-body font-semibold text-sm px-5 py-2 rounded-full transition-colors"
            >
              {loading ? "..." : "Aplicar"}
            </button>
          </div>
          {error && (
            <p className="font-body text-xs text-red-400 text-center">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
