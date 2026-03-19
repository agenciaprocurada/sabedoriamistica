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

export function VendaRow({ sale }: { sale: Sale }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        className="border-b border-gold-subtle/50 hover:bg-white/3 transition-colors cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <td className="px-5 py-3 text-text-muted text-xs whitespace-nowrap">
          {formatDate(sale.created_at)}
        </td>
        <td className="px-5 py-3">
          <p className="text-text-secondary text-sm">{sale.profiles?.name ?? "—"}</p>
          <p className="text-text-muted text-xs">{sale.profiles?.email ?? ""}</p>
        </td>
        <td className="px-5 py-3 text-text-muted text-xs max-w-[180px] truncate">
          {sale.dreams?.description
            ? sale.dreams.description.slice(0, 60) + "..."
            : "—"}
        </td>
        <td className="px-5 py-3 text-right text-text-primary font-medium text-sm whitespace-nowrap">
          {formatBRL(sale.amount)}
        </td>
        <td className="px-5 py-3">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[sale.status] ?? ""}`}>
            {sale.status}
          </span>
        </td>
        <td className="px-5 py-3 text-text-muted text-xs">{open ? "▲" : "▼"}</td>
      </tr>

      {open && (
        <tr className="border-b border-gold-subtle/50 bg-mystic-input/30">
          <td colSpan={6} className="px-5 py-4">
            <div className="space-y-4 text-sm font-body">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-text-muted uppercase tracking-wider mb-0.5">ID Pagamento</p>
                  <p className="text-text-secondary font-mono">{sale.id.slice(0, 8)}…</p>
                </div>
                <div>
                  <p className="text-text-muted uppercase tracking-wider mb-0.5">AbacatePay</p>
                  <p className="text-text-secondary font-mono">{sale.abacate_billing_id ?? "—"}</p>
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
          </td>
        </tr>
      )}
    </>
  );
}
