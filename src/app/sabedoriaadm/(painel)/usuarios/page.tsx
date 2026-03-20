import type { Metadata } from "next";
import Link from "next/link";
import { getAdminSupabase } from "@/lib/admin/supabase";
import { UserSearch } from "./UserSearch";

export const metadata: Metadata = {
  title: "Usuários | Admin SM",
  robots: "noindex, nofollow",
};

const PAGE_SIZE = 20;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const search = searchParams.search ?? "";

  const db = getAdminSupabase();
  let query = db
    .from("profiles")
    .select("id, name, email, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data: profiles, count } = await query;

  const ids = (profiles ?? []).map((p) => p.id);
  const [{ data: dreamCounts }, { data: paymentCounts }] = await Promise.all([
    db.from("dreams").select("user_id").in("user_id", ids),
    db.from("payments").select("user_id").eq("status", "completed").in("user_id", ids),
  ]);

  const dreamMap: Record<string, number> = {};
  const payMap: Record<string, number> = {};
  (dreamCounts ?? []).forEach((d) => { dreamMap[d.user_id] = (dreamMap[d.user_id] ?? 0) + 1; });
  (paymentCounts ?? []).forEach((p) => { payMap[p.user_id] = (payMap[p.user_id] ?? 0) + 1; });

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(p));
    return `/sabedoriaadm/usuarios?${params.toString()}`;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">Usuários</h1>
        <UserSearch />
      </div>

      <div className="bg-mystic-card border border-gold-subtle rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-gold-subtle text-text-muted text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Nome</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Cadastro</th>
                <th className="text-right px-5 py-3">Sonhos</th>
                <th className="text-right px-5 py-3">Compras</th>
              </tr>
            </thead>
            <tbody>
              {(profiles ?? []).map((u: any) => (
                <tr
                  key={u.id}
                  className="border-b border-gold-subtle/50 hover:bg-white/3 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/sabedoriaadm/usuarios/${u.id}`}
                      className="text-text-secondary hover:text-gold transition-colors"
                    >
                      {u.name ?? "—"}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-text-muted">{u.email}</td>
                  <td className="px-5 py-3 text-text-muted text-xs">{formatDate(u.created_at)}</td>
                  <td className="px-5 py-3 text-right text-text-secondary">{dreamMap[u.id] ?? 0}</td>
                  <td className="px-5 py-3 text-right text-text-secondary">{payMap[u.id] ?? 0}</td>
                </tr>
              ))}
              {(profiles ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-text-muted">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between font-body text-sm">
        <p className="text-text-muted">
          Página {page} de {totalPages} &nbsp;•&nbsp; {count ?? 0} usuários
        </p>
        <div className="flex gap-2">
          {page > 1 && (
            <Link href={pageUrl(page - 1)} className="px-4 py-2 rounded-xl border border-gold-subtle text-text-secondary hover:text-text-primary hover:border-gold/30 transition-colors">
              ← Anterior
            </Link>
          )}
          {page < totalPages && (
            <Link href={pageUrl(page + 1)} className="px-4 py-2 rounded-xl border border-gold-subtle text-text-secondary hover:text-text-primary hover:border-gold/30 transition-colors">
              Próximo →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
