import type { Metadata } from "next";
import Link from "next/link";
import { getAdminSupabase } from "@/lib/admin/supabase";
import { VendasFilters } from "./VendasFilters";
import { VendaRow } from "./VendaDetail";

export const metadata: Metadata = {
  title: "Vendas | Admin SM",
  robots: "noindex, nofollow",
};

const PAGE_SIZE = 20;

function buildQuery(
  db: ReturnType<typeof getAdminSupabase>,
  status: string,
  period: string,
  page: number
) {
  let q = db
    .from("payments")
    .select(
      `id, amount, status, created_at, completed_at, abacate_billing_id,
       profiles!user_id(name, email),
       dreams!dream_id(description, free_analysis, paid_analysis)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (status) q = q.eq("status", status);
  if (period === "today") {
    const s = new Date(); s.setHours(0, 0, 0, 0);
    q = q.gte("created_at", s.toISOString());
  } else if (period === "7d") {
    q = q.gte("created_at", new Date(Date.now() - 7 * 86400_000).toISOString());
  } else if (period === "30d") {
    q = q.gte("created_at", new Date(Date.now() - 30 * 86400_000).toISOString());
  }
  return q;
}

export default async function VendasPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string; period?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const status = searchParams.status ?? "";
  const period = searchParams.period ?? "";

  const db = getAdminSupabase();
  const { data, count } = await buildQuery(db, status, period, page);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (period) params.set("period", period);
    params.set("page", String(p));
    return `/sabedoriaadm/vendas?${params.toString()}`;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">Vendas</h1>
        <VendasFilters />
      </div>

      <div className="bg-mystic-card border border-gold-subtle rounded-2xl overflow-hidden">
        {/* Column headers */}
        <div className="flex items-center gap-4 px-5 py-3 border-b border-gold-subtle text-text-muted text-xs uppercase tracking-wider">
          <div className="w-28 shrink-0">Data</div>
          <div className="flex-1">Cliente</div>
          <div className="hidden lg:block w-52 shrink-0">Sonho</div>
          <div className="w-20 shrink-0 text-right">Valor</div>
          <div className="w-24 shrink-0">Status</div>
          <div className="w-4 shrink-0" />
        </div>

        {(data ?? []).length === 0 ? (
          <div className="px-5 py-12 text-center font-body text-sm text-text-muted">
            Nenhuma venda encontrada.
          </div>
        ) : (
          <div>
            {(data ?? []).map((sale: any) => (
              <VendaRow key={sale.id} sale={sale} />
            ))}
          </div>
        )}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between font-body text-sm">
        <p className="text-text-muted">
          Página {page} de {totalPages} &nbsp;•&nbsp; {count ?? 0} resultados
        </p>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              href={pageUrl(page - 1)}
              className="px-4 py-2 rounded-xl border border-gold-subtle text-text-secondary hover:text-text-primary hover:border-gold/30 transition-colors"
            >
              ← Anterior
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={pageUrl(page + 1)}
              className="px-4 py-2 rounded-xl border border-gold-subtle text-text-secondary hover:text-text-primary hover:border-gold/30 transition-colors"
            >
              Próximo →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
