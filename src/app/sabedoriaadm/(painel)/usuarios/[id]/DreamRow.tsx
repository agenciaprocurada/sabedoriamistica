"use client";

import { useState } from "react";

interface Dream {
  id: string;
  description?: string;
  free_analysis?: string;
  paid_analysis?: string;
  status?: string;
  is_paid?: boolean;
  created_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR");
}

export function DreamRow({ dream }: { dream: Dream }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        className="border-b border-gold-subtle/50 hover:bg-white/3 transition-colors cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <td className="px-5 py-3 text-text-muted text-xs whitespace-nowrap">
          {formatDate(dream.created_at)}
        </td>
        <td className="px-5 py-3 text-text-secondary max-w-[200px] truncate">
          {dream.description ? dream.description.slice(0, 60) + "..." : "—"}
        </td>
        <td className="px-5 py-3 text-text-muted text-xs">{dream.status ?? "—"}</td>
        <td className="px-5 py-3 text-xs">
          {dream.is_paid ? (
            <span className="text-green-400">Sim</span>
          ) : (
            <span className="text-text-muted">Não</span>
          )}
        </td>
        <td className="px-5 py-3 text-text-muted text-xs">{open ? "▲" : "▼"}</td>
      </tr>

      {open && (
        <tr className="border-b border-gold-subtle/50 bg-mystic-input/30">
          <td colSpan={5} className="px-5 py-4">
            <div className="space-y-4 text-sm font-body">
              {dream.description && (
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Sonho</p>
                  <p className="text-text-secondary leading-relaxed bg-mystic-card rounded-xl p-3">
                    {dream.description}
                  </p>
                </div>
              )}
              {dream.free_analysis && (
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Análise Gratuita</p>
                  <p className="text-text-secondary leading-relaxed bg-mystic-card rounded-xl p-3 whitespace-pre-wrap">
                    {dream.free_analysis}
                  </p>
                </div>
              )}
              {dream.paid_analysis && (
                <div>
                  <p className="text-gold text-xs uppercase tracking-wider mb-1">Análise Completa</p>
                  <p className="text-text-secondary leading-relaxed bg-mystic-card rounded-xl p-3 whitespace-pre-wrap">
                    {dream.paid_analysis}
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
