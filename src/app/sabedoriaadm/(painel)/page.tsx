import type { Metadata } from "next";
import Link from "next/link";
import { getAdminSupabase } from "@/lib/admin/supabase";

export const metadata: Metadata = {
  title: "Dashboard | Admin SM",
  robots: "noindex, nofollow",
};

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function getInitials(name: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  pending: {
    cls: "border border-amber-500/40 text-amber-400 bg-amber-500/10",
    label: "Pendente",
  },
  completed: {
    cls: "border border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    label: "Concluída",
  },
  failed: {
    cls: "border border-red-500/40 text-red-400 bg-red-500/10",
    label: "Falhou",
  },
};

const AVATAR_COLORS = [
  "bg-violet-500/20 text-violet-300",
  "bg-blue-500/20 text-blue-300",
  "bg-emerald-500/20 text-emerald-300",
  "bg-amber-500/20 text-amber-300",
  "bg-rose-500/20 text-rose-300",
  "bg-cyan-500/20 text-cyan-300",
];

function avatarColor(id: string) {
  let n = 0;
  for (let i = 0; i < id.length; i++) n += id.charCodeAt(i);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

export default async function AdminDashboard() {
  const db = getAdminSupabase();

  const [
    { count: totalUsers },
    { count: totalDreams },
    { count: checkoutStarted },
    { count: totalSales },
    { data: revenueRows },
    { data: recentSales },
    { data: recentUsers },
  ] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }),
    db
      .from("dreams")
      .select("*", { count: "exact", head: true })
      .neq("status", "pending"),
    db
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    db
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed"),
    db.from("payments").select("amount").eq("status", "completed"),
    db
      .from("payments")
      .select("id, amount, status, created_at, profiles!user_id(name)")
      .order("created_at", { ascending: false })
      .limit(8),
    db
      .from("profiles")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const totalRevenue = (revenueRows ?? []).reduce(
    (s, p) => s + (p.amount ?? 0),
    0
  );

  const metrics = [
    {
      label: "Sonhos Analisados",
      value: (totalDreams ?? 0).toLocaleString("pt-BR"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      ),
      accent: "text-blue-400",
      bg: "bg-blue-500/10",
      href: null,
    },
    {
      label: "Checkout Iniciado",
      value: (checkoutStarted ?? 0).toLocaleString("pt-BR"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      ),
      accent: "text-amber-400",
      bg: "bg-amber-500/10",
      href: "/sabedoriaadm/vendas?status=pending",
    },
    {
      label: "Vendas Concluídas",
      value: (totalSales ?? 0).toLocaleString("pt-BR"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10",
      href: "/sabedoriaadm/vendas?status=completed",
    },
    {
      label: "Receita Total",
      value: formatBRL(totalRevenue),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: "text-gold",
      bg: "bg-gold/10",
      href: "/sabedoriaadm/vendas",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Dashboard
          </h1>
          <p className="font-body text-sm text-text-muted mt-0.5">
            Visão geral da plataforma
          </p>
        </div>
        <div className="font-body text-xs text-text-muted bg-mystic-elevated border border-gold-subtle rounded-lg px-3 py-1.5">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="group bg-mystic-card border border-gold-subtle rounded-2xl p-5 flex flex-col gap-4 hover:border-gold/30 transition-all duration-200"
          >
            {/* Icon + label row */}
            <div className="flex items-center justify-between">
              <span className="font-body text-xs text-text-muted uppercase tracking-wider">
                {m.label}
              </span>
              <div className={`w-9 h-9 rounded-xl ${m.bg} ${m.accent} flex items-center justify-center shrink-0`}>
                {m.icon}
              </div>
            </div>

            {/* Value */}
            <div className="flex items-end justify-between gap-2">
              <span className={`font-display text-2xl font-bold leading-none ${m.accent}`}>
                {m.value}
              </span>
              {m.href && (
                <Link
                  href={m.href}
                  className="text-[11px] font-body text-text-muted hover:text-text-secondary transition-colors shrink-0 mb-0.5"
                >
                  Ver →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main content: two-column on desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Últimas Vendas — wider column */}
        <section className="xl:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-text-primary">
              Últimas Vendas
            </h2>
            <Link
              href="/sabedoriaadm/vendas"
              className="font-body text-xs text-text-muted hover:text-gold transition-colors"
            >
              Ver todas →
            </Link>
          </div>

          <div className="bg-mystic-card border border-gold-subtle rounded-2xl overflow-hidden">
            {(recentSales ?? []).length === 0 ? (
              <div className="px-5 py-12 text-center font-body text-sm text-text-muted">
                Nenhuma venda ainda.
              </div>
            ) : (
              <div className="divide-y divide-gold-subtle/50">
                {(recentSales ?? []).map((sale: any) => {
                  const badge = STATUS_BADGE[sale.status];
                  return (
                    <div
                      key={sale.id}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 transition-colors"
                    >
                      {/* Date */}
                      <div className="w-12 shrink-0 text-center">
                        <p className="font-body text-[13px] font-medium text-text-secondary leading-none">
                          {formatDateShort(sale.created_at).split(" ")[0]}
                        </p>
                        <p className="font-body text-[11px] text-text-muted mt-0.5 uppercase">
                          {formatDateShort(sale.created_at).split(" ")[1]}
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="w-px h-8 bg-gold-subtle shrink-0" />

                      {/* Client name */}
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-text-primary truncate">
                          {sale.profiles?.name ?? "—"}
                        </p>
                        <p className="font-body text-[11px] text-text-muted mt-0.5">
                          {new Date(sale.created_at).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* Amount */}
                      <p className="font-display text-sm font-semibold text-text-primary shrink-0">
                        {formatBRL(sale.amount)}
                      </p>

                      {/* Status */}
                      <span
                        className={`hidden sm:inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium shrink-0 ${badge?.cls ?? ""}`}
                      >
                        {badge?.label ?? sale.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Novos Usuários — narrower column */}
        <section className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-text-primary">
              Novos Usuários
            </h2>
            <Link
              href="/sabedoriaadm/usuarios"
              className="font-body text-xs text-text-muted hover:text-gold transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          <div className="bg-mystic-card border border-gold-subtle rounded-2xl overflow-hidden">
            {(recentUsers ?? []).length === 0 ? (
              <div className="px-5 py-12 text-center font-body text-sm text-text-muted">
                Nenhum usuário ainda.
              </div>
            ) : (
              <div className="divide-y divide-gold-subtle/50">
                {(recentUsers ?? []).map((u: any) => (
                  <Link
                    key={u.id}
                    href={`/sabedoriaadm/usuarios/${u.id}`}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/3 transition-colors group/row"
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-display text-[13px] font-bold ${avatarColor(u.id)}`}
                    >
                      {getInitials(u.name)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-text-primary truncate group-hover/row:text-gold transition-colors">
                        {u.name ?? "Sem nome"}
                      </p>
                      <p className="font-body text-[11px] text-text-muted truncate mt-0.5">
                        {u.email}
                      </p>
                    </div>

                    {/* Date */}
                    <p className="font-body text-[11px] text-text-muted shrink-0">
                      {formatDateShort(u.created_at)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
