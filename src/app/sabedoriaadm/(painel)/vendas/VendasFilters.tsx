"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function VendasFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";
  const period = searchParams.get("period") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`/sabedoriaadm/vendas?${params.toString()}`);
    },
    [router, searchParams]
  );

  const selectClass =
    "bg-mystic-input border border-gold-subtle rounded-xl px-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-gold/50 transition-colors";

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={status}
        onChange={(e) => update("status", e.target.value)}
        className={selectClass}
      >
        <option value="">Todos os status</option>
        <option value="pending">Pendentes</option>
        <option value="completed">Concluídas</option>
        <option value="failed">Falhas</option>
      </select>

      <select
        value={period}
        onChange={(e) => update("period", e.target.value)}
        className={selectClass}
      >
        <option value="">Todos os períodos</option>
        <option value="today">Hoje</option>
        <option value="7d">Últimos 7 dias</option>
        <option value="30d">Últimos 30 dias</option>
      </select>
    </div>
  );
}
