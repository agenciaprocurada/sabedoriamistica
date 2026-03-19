import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/admin/supabase";
import { EditUserForm } from "./EditUserForm";
import { DreamRow } from "./DreamRow";

export const metadata: Metadata = {
  title: "Usuário | Admin SM",
  robots: "noindex, nofollow",
};

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR");
}

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const STATUS_BADGE: Record<string, string> = {
  pending: "border border-gold/50 text-gold bg-gold/10",
  completed: "border border-green-500/50 text-green-400 bg-green-500/10",
  failed: "border border-red-500/50 text-red-400 bg-red-500/10",
};

function initials(name?: string | null) {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const db = getAdminSupabase();

  const [{ data: profile }, { data: dreams }, { data: payments }] =
    await Promise.all([
      db.from("profiles").select("*").eq("id", params.id).single(),
      db
        .from("dreams")
        .select("id, description, free_analysis, paid_analysis, status, is_paid, created_at")
        .eq("user_id", params.id)
        .order("created_at", { ascending: false }),
      db
        .from("payments")
        .select("id, amount, status, created_at, completed_at, abacate_billing_id")
        .eq("user_id", params.id)
        .order("created_at", { ascending: false }),
    ]);

  if (!profile) notFound();

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Cabeçalho do usuário */}
      <div className="flex items-center gap-5">
        <div className="h-14 w-14 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
          <span className="font-display font-bold text-lg text-gold">
            {initials(profile.name)}
          </span>
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            {profile.name ?? "Sem nome"}
          </h1>
          <p className="font-body text-sm text-text-muted">{profile.email}</p>
          <p className="font-body text-xs text-text-muted">
            Cadastrado em {formatDate(profile.created_at)}
          </p>
        </div>
      </div>

      {/* Edição */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-text-primary">Editar Dados</h2>
        <div className="bg-mystic-card border border-gold-subtle rounded-2xl p-6">
          <EditUserForm
            userId={profile.id}
            initialName={profile.name ?? ""}
            initialEmail={profile.email ?? ""}
          />
        </div>
      </section>

      {/* Sonhos */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Sonhos ({(dreams ?? []).length})
        </h2>
        <div className="bg-mystic-card border border-gold-subtle rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-gold-subtle text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Data</th>
                  <th className="text-left px-5 py-3">Sonho</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Pago</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {(dreams ?? []).map((d: any) => (
                  <DreamRow key={d.id} dream={d} />
                ))}
                {(dreams ?? []).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-text-muted">
                      Nenhum sonho registrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pagamentos */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Pagamentos ({(payments ?? []).length})
        </h2>
        <div className="bg-mystic-card border border-gold-subtle rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-gold-subtle text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Data</th>
                  <th className="text-right px-5 py-3">Valor</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">ID AbacatePay</th>
                </tr>
              </thead>
              <tbody>
                {(payments ?? []).map((p: any) => (
                  <tr key={p.id} className="border-b border-gold-subtle/50 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3 text-text-muted text-xs whitespace-nowrap">{formatDate(p.created_at)}</td>
                    <td className="px-5 py-3 text-right text-text-primary font-medium">{formatBRL(p.amount)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[p.status] ?? ""}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-text-muted font-mono text-xs">{p.abacate_billing_id ?? "—"}</td>
                  </tr>
                ))}
                {(payments ?? []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-text-muted">
                      Nenhum pagamento registrado.
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
