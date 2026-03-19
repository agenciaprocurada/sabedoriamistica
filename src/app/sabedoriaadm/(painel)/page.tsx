import type { Metadata } from "next";
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

const STATUS_BADGE: Record<string, string> = {
  pending: "border border-gold/50 text-gold bg-gold/10",
  completed: "border border-green-500/50 text-green-400 bg-green-500/10",
  failed: "border border-red-500/50 text-red-400 bg-red-500/10",
};

export default async function AdminDashboard() {
  const db = getAdminSupabase();

  const [
    { count: totalUsers },
    { count: totalDreams },
    { count: totalSales },
    { data: revenueRows },
    { data: recentSales },
    { data: recentUsers },
  ] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }),
    db.from("dreams").select("*", { count: "exact", head: true }).neq("status", "pending"),
    db.from("payments").select("*", { count: "exact", head: true }).eq("status", "completed"),
    db.from("payments").select("amount").eq("status", "completed"),
    db
      .from("payments")
      .select("id, amount, status, created_at, profiles!user_id(name)")
      .order("created_at", { ascending: false })
      .limit(10),
    db
      .from("profiles")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const totalRevenue = (revenueRows ?? []).reduce(
    (s, p) => s + (p.amount ?? 0),
    0
  );

  const metrics = [
    { label: "Usuários", value: totalUsers ?? 0 },
    { label: "Sonhos Analisados", value: totalDreams ?? 0 },
    { label: "Vendas Concluídas", value: totalSales ?? 0 },
    { label: "Receita Total", value: formatBRL(totalRevenue), wide: true },
  ];

  return (
    <div className="space-y-10">
      <h1 className="font-display text-2xl font-bold text-text-primary">Dashboard</h1>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-mystic-elevated border border-gold-subtle rounded-2xl p-5 space-y-1">
            <p className="font-body text-[13px] text-text-secondary">{m.label}</p>
            <p className="font-display text-[28px] font-bold text-gold leading-tight">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Últimas Vendas */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Últimas Vendas
        </h2>
        <div className="bg-mystic-card border border-gold-subtle rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-gold-subtle text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Data</th>
                  <th className="text-left px-5 py-3">Cliente</th>
                  <th className="text-right px-5 py-3">Valor</th>
                  <th className="text-left px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {(recentSales ?? []).map((sale: any) => (
                  <tr key={sale.id} className="border-b border-gold-subtle/50 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3 text-text-muted text-xs whitespace-nowrap">
                      {formatDate(sale.created_at)}
                    </td>
                    <td className="px-5 py-3 text-text-secondary">
                      {sale.profiles?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-right text-text-primary font-medium">
                      {formatBRL(sale.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[sale.status] ?? ""}`}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(recentSales ?? []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-text-muted">
                      Nenhuma venda ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Novos Usuários */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Novos Usuários
        </h2>
        <div className="bg-mystic-card border border-gold-subtle rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-gold-subtle text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Nome</th>
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-5 py-3">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {(recentUsers ?? []).map((u: any) => (
                  <tr key={u.id} className="border-b border-gold-subtle/50 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3 text-text-secondary">{u.name ?? "—"}</td>
                    <td className="px-5 py-3 text-text-muted">{u.email}</td>
                    <td className="px-5 py-3 text-text-muted text-xs whitespace-nowrap">
                      {formatDate(u.created_at)}
                    </td>
                  </tr>
                ))}
                {(recentUsers ?? []).length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-text-muted">
                      Nenhum usuário ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
