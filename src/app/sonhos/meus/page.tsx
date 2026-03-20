import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meus Sonhos | Sabedoria Mística",
  description: "Veja todos os seus sonhos interpretados.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function MeusSonhosPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/sonhos/meus");
  }

  const { data: dreams } = await supabase
    .from("dreams")
    .select("id, description, free_analysis, is_paid, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 py-4 md:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Meus Sonhos
          </h1>
          <p className="font-body text-text-secondary text-sm mt-1">
            Histórico das suas interpretações
          </p>
        </div>
        <Link
          href="/sonhos"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gold hover:bg-gold-light text-mystic-bg font-body font-semibold text-sm px-5 py-2.5 shadow-gold transition-all duration-200 shrink-0"
        >
          ✦ Interpretar Novo Sonho
        </Link>
      </div>

      {/* Empty state */}
      {(dreams ?? []).length === 0 && (
        <div className="bg-mystic-card border border-gold-subtle rounded-2xl p-12 text-center space-y-4">
          <p className="text-4xl">🌙</p>
          <p className="font-display text-xl text-text-primary">
            Nenhum sonho interpretado ainda
          </p>
          <p className="font-body text-text-secondary text-sm">
            Descreva seu primeiro sonho e descubra suas mensagens ocultas.
          </p>
          <Link
            href="/sonhos"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold hover:bg-gold-light text-mystic-bg font-body font-semibold text-sm px-6 py-3 shadow-gold transition-all duration-200"
          >
            Interpretar Agora
          </Link>
        </div>
      )}

      {/* Dream list */}
      {(dreams ?? []).length > 0 && (
        <div className="space-y-4">
          {(dreams ?? []).map((dream) => {
            const isPaid = dream.is_paid || dream.status === "paid_analyzed";
            const hasAnalysis =
              dream.status === "analyzed" ||
              dream.status === "paid_analyzed" ||
              dream.free_analysis;

            return (
              <div
                key={dream.id}
                className="bg-mystic-card border border-gold-subtle rounded-2xl p-5 space-y-4 hover:border-gold/30 transition-colors"
              >
                {/* Top row: date + badge */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="font-body text-xs text-text-muted">
                    {formatDate(dream.created_at)}
                  </p>
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border border-gold/40 text-gold bg-gold/10">
                      ✦ Análise Completa
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border border-white/20 text-text-muted bg-white/5">
                      Gratuita
                    </span>
                  )}
                </div>

                {/* Dream description */}
                <p className="font-body text-sm text-text-secondary leading-relaxed line-clamp-3">
                  {dream.description}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-gold-subtle">
                  {hasAnalysis && (
                    <Link
                      href={
                        isPaid
                          ? `/sonhos/completo/${dream.id}`
                          : `/sonhos/resultado/${dream.id}`
                      }
                      className="flex-1 text-center font-body text-sm border border-gold-subtle text-gold px-4 py-2 rounded-full hover:bg-gold-subtle transition-colors duration-200"
                    >
                      {isPaid ? "Ver Análise Completa" : "Ver Análise Gratuita"}
                    </Link>
                  )}

                  {!isPaid && (
                    <Link
                      href={`/sonhos/checkout/${dream.id}`}
                      className="flex-1 text-center font-body font-semibold text-sm bg-gold hover:bg-gold-light text-mystic-bg px-4 py-2 rounded-full shadow-gold transition-all duration-200"
                    >
                      🔓 Desbloquear Análise Completa
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
