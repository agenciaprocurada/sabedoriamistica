import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui";
import { DreamCollapse } from "@/app/sonhos/resultado/[id]/DreamCollapse";
import { AnalysisMarkdown } from "@/app/sonhos/resultado/[id]/AnalysisMarkdown";
import { PaymentPolling } from "./PaymentPolling";
import { PollingFallback } from "./PollingFallback";
import { SessionToast } from "./SessionToast";
import { ShareButtons } from "./ShareButtons";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sua Interpretação Completa | Sabedoria Mística",
    description:
      "Interpretação completa e personalizada do seu sonho com análise profunda dos símbolos e mensagens do inconsciente.",
  };
}

interface Props {
  params: { id: string };
  searchParams: { session_id?: string };
}

export default async function CompletoPage({ params, searchParams }: Props) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/sonhos/completo/${params.id}`);
  }

  const { data: dream } = await supabase
    .from("dreams")
    .select("id, description, paid_analysis, is_paid, created_at")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!dream) redirect("/sonhos");

  // Pagamento ainda não confirmado pelo webhook — polling no cliente
  if (!dream.is_paid) {
    return <PaymentPolling dreamId={params.id} />;
  }

  const dateFormatted = new Date(dream.created_at).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // paid_analysis ainda não foi gerada — mostrar polling
  if (!dream.paid_analysis) {
    return <PollingFallback dreamId={params.id} />;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">

      {/* Toast para acesso recém-liberado */}
      {searchParams.session_id && <SessionToast />}

      {/* ── Header com sparkle ── */}
      <div className="text-center space-y-3">
        <div className="relative inline-block">
          <span className="sparkle-star absolute -top-3 -left-4 text-gold opacity-70 animate-pulse text-sm">✦</span>
          <span className="sparkle-star absolute -top-2 -right-3 text-gold opacity-50 animate-pulse text-xs" style={{ animationDelay: "0.4s" }}>✦</span>
          <span className="sparkle-star absolute -bottom-2 left-0 text-gold opacity-60 animate-pulse text-xs" style={{ animationDelay: "0.8s" }}>✦</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gold">
            🌟 Sua Interpretação Completa
          </h1>
        </div>
        <p className="font-body text-text-muted text-sm">{dateFormatted}</p>
        <Badge variant="solid">Interpretação Premium ✦</Badge>
      </div>

      {/* ── Card: sonho original ── */}
      <div className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-6 space-y-3">
        <p className="font-body text-xs uppercase tracking-widest text-text-muted">
          Seu sonho
        </p>
        <DreamCollapse text={dream.description} />
      </div>

      {/* ── Análise premium ── */}
      <div className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gold-subtle">
          <span className="text-gold text-sm">✦</span>
          <p className="font-body text-xs uppercase tracking-widest text-text-muted">
            Análise Completa
          </p>
        </div>
        <AnalysisMarkdown content={dream.paid_analysis} />
      </div>

      {/* ── Compartilhamento ── */}
      <div className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-6 space-y-4 text-center">
        <p className="font-display text-base font-semibold text-text-primary">
          Indique para um amigo
        </p>
        <p className="font-body text-text-secondary text-sm">
          Compartilhe essa experiência com alguém especial.
        </p>
        <ShareButtons dreamId={params.id} />
      </div>

      {/* ── Separador ── */}
      <div className="flex items-center justify-center gap-3 text-gold opacity-60 text-sm">
        <span>✦</span>
        <span>✦</span>
        <span>✦</span>
      </div>

      {/* ── CTAs ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/sonhos/analisar"
          className="flex-1 text-center font-body font-semibold text-base bg-gold hover:bg-gold-light text-mystic-bg px-6 py-3 rounded-full shadow-gold transition-all duration-200"
        >
          🌙 Interpretar Outro Sonho
        </a>
        <a
          href="/sonhos/meus"
          className="flex-1 text-center font-body text-sm border border-gold-subtle text-text-secondary px-6 py-3 rounded-full hover:bg-mystic-elevated transition-colors duration-200"
        >
          Voltar ao Portal
        </a>
      </div>

    </div>
  );
}
