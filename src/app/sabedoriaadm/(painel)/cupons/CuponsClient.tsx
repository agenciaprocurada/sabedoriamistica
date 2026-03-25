"use client";

import { useState } from "react";

interface Coupon {
  id: string;
  code: string;
  is_active: boolean;
  created_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function CuponsClient({ initial }: { initial: Coupon[] }) {
  const [coupons, setCoupons] = useState<Coupon[]>(initial);
  const [newCode, setNewCode] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAdding(true);
    try {
      const res = await fetch("/api/admin/cupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newCode }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error); return; }
      setCoupons((prev) => [json.data, ...prev]);
      setNewCode("");
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(coupon: Coupon) {
    setLoadingId(coupon.id);
    try {
      const res = await fetch(`/api/admin/cupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !coupon.is_active }),
      });
      const json = await res.json();
      if (res.ok) {
        setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? json.data : c)));
      }
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este cupom permanentemente?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/cupons/${id}`, { method: "DELETE" });
      if (res.ok) setCoupons((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setLoadingId(null);
    }
  }

  const active = coupons.filter((c) => c.is_active);
  const inactive = coupons.filter((c) => !c.is_active);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* ── Adicionar cupom ── */}
      <div className="bg-mystic-card border border-gold-subtle rounded-2xl p-5 space-y-4">
        <h2 className="font-display text-base font-semibold text-text-primary">
          Novo cupom
        </h2>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            value={newCode}
            onChange={(e) => {
              setError("");
              setNewCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""));
            }}
            placeholder="Ex: PROMO50, GRATIS, VIP2026"
            maxLength={30}
            className="flex-1 bg-mystic-elevated border border-gold-subtle rounded-xl px-4 py-2.5 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
          />
          <button
            type="submit"
            disabled={adding || newCode.length < 3}
            className="shrink-0 bg-gold hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed text-mystic-bg font-body font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            {adding ? "Criando..." : "Criar"}
          </button>
        </form>
        {error && (
          <p className="font-body text-xs text-red-400">{error}</p>
        )}
        <p className="font-body text-xs text-text-muted">
          Apenas letras maiúsculas, números, <code>_</code> e <code>-</code>. Mínimo 3 caracteres.
        </p>
      </div>

      {/* ── Cupons ativos ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-text-primary">
            Ativos
            <span className="ml-2 text-xs font-body text-gold bg-gold/10 px-2 py-0.5 rounded-full">
              {active.length}
            </span>
          </h2>
        </div>

        {active.length === 0 ? (
          <p className="font-body text-sm text-text-muted py-4 text-center">
            Nenhum cupom ativo.
          </p>
        ) : (
          <div className="bg-mystic-card border border-gold-subtle rounded-2xl overflow-hidden">
            {active.map((c, i) => (
              <CouponRow
                key={c.id}
                coupon={c}
                loading={loadingId === c.id}
                onToggle={handleToggle}
                onDelete={handleDelete}
                last={i === active.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Cupons desativados ── */}
      {inactive.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-base font-semibold text-text-muted">
            Desativados
            <span className="ml-2 text-xs font-body bg-white/5 px-2 py-0.5 rounded-full">
              {inactive.length}
            </span>
          </h2>
          <div className="bg-mystic-card border border-white/5 rounded-2xl overflow-hidden opacity-75">
            {inactive.map((c, i) => (
              <CouponRow
                key={c.id}
                coupon={c}
                loading={loadingId === c.id}
                onToggle={handleToggle}
                onDelete={handleDelete}
                last={i === inactive.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CouponRow({
  coupon,
  loading,
  onToggle,
  onDelete,
  last,
}: {
  coupon: Coupon;
  loading: boolean;
  onToggle: (c: Coupon) => void;
  onDelete: (id: string) => void;
  last: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 px-5 py-3.5 ${
        !last ? "border-b border-gold-subtle" : ""
      }`}
    >
      {/* Código */}
      <span className="flex-1 font-body font-semibold text-sm text-text-primary tracking-wider">
        {coupon.code}
      </span>

      {/* Data */}
      <span className="hidden sm:block font-body text-xs text-text-muted w-24 shrink-0">
        {formatDate(coupon.created_at)}
      </span>

      {/* Badge status */}
      <span
        className={`shrink-0 text-xs font-body px-2.5 py-1 rounded-full ${
          coupon.is_active
            ? "bg-emerald-500/15 text-emerald-400"
            : "bg-white/5 text-text-muted"
        }`}
      >
        {coupon.is_active ? "Ativo" : "Inativo"}
      </span>

      {/* Ações */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onToggle(coupon)}
          disabled={loading}
          title={coupon.is_active ? "Desativar" : "Ativar"}
          className="p-1.5 rounded-lg text-text-muted hover:text-gold hover:bg-gold/10 transition-colors disabled:opacity-40"
        >
          {loading ? (
            <span className="block w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          ) : coupon.is_active ? (
            /* Ícone toggle off */
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
          ) : (
            /* Ícone toggle on */
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <button
          onClick={() => onDelete(coupon.id)}
          disabled={loading}
          title="Excluir"
          className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-40"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
