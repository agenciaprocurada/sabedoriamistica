"use client";

import { useState } from "react";

interface Sale {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  completed_at?: string;
  abacate_billing_id?: string;
  profiles?: { name?: string; email?: string } | null;
  dreams?: {
    description?: string;
    free_analysis?: string;
    paid_analysis?: string;
  } | null;
}

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR");
}

const STATUS_BADGE: Record<string, string> = {
  pending: "border border-gold/50 text-gold bg-gold/10",
  completed: "border border-green-500/50 text-green-400 bg-green-500/10",
  failed: "border border-red-500/50 text-red-400 bg-red-500/10",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  completed: "Concluída",
  failed: "Falhou",
};

export function VendaRow({ sale }: { sale: Sale }) {
  const [open, setOpen] = useState(false);
  const badge = STATUS_BADGE[sale.status] ?? "";

  return (
    <div className="border-b border-gold-subtle/50 last:border-0">
      {/* Main row */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-5 py-3.5 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Date */}
          <div className="w-28 shrink-0">
            <p className="font-body text-xs text-text-muted whitespace-nowrap">
              {formatDate(sale.created_at)}
            </p>
          </div>

          {/* Client */}
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm text-text-secondary truncate">
              {sale.profiles?.name ?? "—"}
            </p>
            <p className="font-body text-xs text-text-muted truncate">
              {sale.profiles?.email ?? ""}
            </p>
          </div>

          {/* Dream preview — hidden on small */}
          <div className="hidden lg:block w-52 shrink-0">
            <p className="font-body text-xs text-text-muted truncate">
              {sale.dreams?.description
                ? sale.dreams.description.slice(0, 55) + "…"
                : "—"}
            </p>
          </div>

          {/* Amount */}
          <div className="w-20 shrink-0 text-right">
            <p className="font-body text-sm font-medium text-text-primary whitespace-nowrap">
              {formatBRL(sale.amount)}
            </p>
          </div>

          {/* Status badge */}
          <div className="w-24 shrink-0">
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}>
              {STATUS_LABEL[sale.status] ?? sale.status}
            </span>
          </div>

          {/* Chevron */}
          <div className="w-4 shrink-0 text-text-muted">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            >
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-5 pb-4 bg-mystic-input/20">
          <div className="space-y-4 text-sm font-body pt-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <p className="text-text-muted uppercase tracking-wider mb-0.5">ID Pagamento</p>
                <p className="text-text-secondary font-mono">{sale.id.slice(0, 8)}…</p>
              </div>
              <div>
                <p className="text-text-muted uppercase tracking-wider mb-0.5">AbacatePay</p>
                <p className="text-text-secondary font-mono break-all">{sale.abacate_billing_id ?? "—"}</p>
              </div>
              <div>
                <p className="text-text-muted uppercase tracking-wider mb-0.5">Criado em</p>
                <p className="text-text-secondary">{formatDate(sale.created_at)}</p>
              </div>
              <div>
                <p className="text-text-muted uppercase tracking-wider mb-0.5">Concluído em</p>
                <p className="text-text-secondary">{formatDate(sale.completed_at)}</p>
              </div>
            </div>

            {sale.dreams?.description && (
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Sonho</p>
                <p className="text-text-secondary leading-relaxed bg-mystic-card rounded-xl p-3">
                  {sale.dreams.description}
                </p>
              </div>
            )}

            {sale.dreams?.free_analysis && (
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Análise Gratuita</p>
                <p className="text-text-secondary leading-relaxed bg-mystic-card rounded-xl p-3 whitespace-pre-wrap">
                  {sale.dreams.free_analysis}
                </p>
              </div>
            )}

            {sale.dreams?.paid_analysis && (
              <div>
                <p className="text-gold text-xs uppercase tracking-wider mb-1">Análise Completa</p>
                <p className="text-text-secondary leading-relaxed bg-mystic-card rounded-xl p-3 whitespace-pre-wrap">
                  {sale.dreams.paid_analysis}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
