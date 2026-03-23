import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui";
import { DreamCollapse } from "./DreamCollapse";
import { AnalysisMarkdown } from "./AnalysisMarkdown";
import { CheckoutBox } from "./CheckoutBox";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Interpretação do Seu Sonho | Sabedoria Mística",
    description:
      "Descubra os símbolos e mensagens ocultas no seu sonho. Interpretação personalizada com simbologia ancestral e arquétipos.",
  };
}

interface Props {
  params: { id: string };
}

const LOREM_PAID = `Neste sonho, os símbolos que emergiram do inconsciente carregam camadas de significado que vão muito além do que foi revelado na leitura inicial. O arquétipo presente nesta experiência onírica aponta para um momento de transição silenciosa, onde forças internas estão reorganizando padrões de comportamento que você talvez ainda não tenha reconhecido conscientemente.

Os elementos simbólicos identificados — especialmente aqueles que parecem banais à primeira vista — são precisamente os que guardam os avisos mais delicados. Existe uma conexão direta entre o que apareceu neste sonho e situações que estão se desenvolvendo em sua vida agora: relações próximas, decisões pendentes, um alerta que seu corpo e mente já perceberam mas que a mente consciente ainda não processou.

A mensagem central do inconsciente neste sonho é clara e urgente para quem sabe decodificá-la. Há um padrão emocional específico sendo repetido, e compreendê-lo agora pode mudar o rumo de algo importante. As orientações práticas derivadas desta análise incluem ações concretas e diretas para os próximos dias — não conselhos genéricos, mas respostas ao que este sonho específico está sinalizando para você.`;

export default async function ResultadoPage({ params }: Props) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/sonhos/resultado/${params.id}`);
  }

  const { data: dream } = await supabase
    .from("dreams")
    .select("id, description, free_analysis, status, created_at, is_paid")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!dream) redirect("/sonhos");

  if (dream.is_paid) {
    redirect(`/sonhos/completo/${params.id}`);
  }

  const dateFormatted = new Date(dream.created_at).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">

      {/* ── Header ── */}
      <div className="text-center space-y-3">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gold">
          🌙 Interpretação do Seu Sonho
        </h1>
        <p className="font-body text-text-muted text-sm">{dateFormatted}</p>
        <Badge variant="outline">Interpretação Gratuita</Badge>
      </div>

      {/* ── Card sonho original ── */}
      <div className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-6 space-y-3">
        <p className="font-body text-xs uppercase tracking-widest text-text-muted">
          Seu sonho
        </p>
        <DreamCollapse text={dream.description} />
      </div>

      {/* ── Análise + upsell integrados ── */}
      <div className="bg-mystic-elevated rounded-2xl border border-gold-subtle overflow-hidden">

        {/* Análise gratuita */}
        <div className="p-6">
          {dream.free_analysis ? (
            <AnalysisMarkdown content={dream.free_analysis} />
          ) : (
            <p className="font-body text-text-secondary text-center py-8">
              A interpretação ainda está sendo preparada...
            </p>
          )}
        </div>

        {/* Preview bloqueado + CTA sobrepostos */}
        <div className="relative select-none overflow-hidden">
          {/* Texto lorem ipsum desfocado — fundo */}
          <div className="px-6 pt-2 pb-6 blur-[3px] opacity-40 pointer-events-none">
            <p className="font-body text-text-secondary text-sm leading-relaxed whitespace-pre-line">
              {LOREM_PAID}
            </p>
          </div>

          {/* Gradiente escurecendo o fundo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(11,13,26,0.5) 0%, rgba(11,13,26,0.88) 55%, #0B0D1A 80%)",
            }}
          />

          {/* CTA flutuando sobre o glow */}
          <div className="absolute inset-0 flex flex-col justify-start items-center px-6 pt-4 gap-3 pointer-events-auto">
            <p className="font-display text-xl font-bold text-text-primary text-center">
              🔓 Desbloquear Interpretação Completa
            </p>
            <p className="font-body text-text-secondary text-sm text-center">
              Seu sonho guarda muito mais do que foi revelado
            </p>
            <CheckoutBox dreamId={params.id} />
            <p className="font-body text-text-muted text-xs text-center">
              🔒 Pagamento seguro &nbsp;•&nbsp; Resultado instantâneo
            </p>
          </div>
        </div>
      </div>

      {/* ── Separador ── */}
      <div className="flex items-center justify-center gap-3 text-gold opacity-60 text-sm">
        <span>✦</span>
        <span>✦</span>
        <span>✦</span>
      </div>

      {/* ── Rodapé ── */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <a
          href="/sonhos/analisar"
          className="flex-1 text-center font-body text-sm border border-gold-subtle text-gold px-5 py-3 rounded-full hover:bg-gold-subtle transition-colors duration-200"
        >
          Interpretar outro sonho
        </a>
        <a
          href="/sonhos/meus"
          className="flex-1 text-center font-body text-sm border border-gold-subtle text-text-secondary px-5 py-3 rounded-full hover:bg-mystic-elevated transition-colors duration-200"
        >
          Meus sonhos
        </a>
      </div>

    </div>
  );
}
