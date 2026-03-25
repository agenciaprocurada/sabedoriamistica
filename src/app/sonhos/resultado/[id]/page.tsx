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

/* ── Lorem Ipsum por seção ── */
const LOREM_ESPIRITUALIDADE = `Do ponto de vista espiritual, seu sonho carrega uma mensagem de renovação profunda. As imagens que emergiram do seu inconsciente apontam para um ciclo que está se encerrando, abrindo caminho para uma nova fase em sua jornada. A sabedoria ancestral reconhece esses padrões como sinais do campo espiritual tentando chamar sua atenção. Há forças invisíveis alinhadas ao seu favor neste momento — mas é preciso que você esteja aberto para recebê-las. O universo fala através dos sonhos justamente quando a mente consciente está silenciosa o suficiente para ouvir.`;

const LOREM_PSICOLOGIA = `Pela perspectiva da psicologia profunda, os elementos centrais do seu sonho refletem um conflito interno não resolvido que pede integração. O arquétipo presente nesta experiência onírica sugere que há uma parte de você que ainda não foi plenamente reconhecida ou aceita. Carl Jung chamava esses fragmentos de "sombra" — aspectos da personalidade que relegamos ao inconsciente, mas que insistem em emergir. O que apareceu no seu sonho é um convite genuíno para olhar para dentro com honestidade e compaixão. Ignorar esse chamado pode perpetuar padrões que você mesmo deseja transformar.`;

const LOREM_SAUDE = `Seu sonho também transmite mensagens sobre o estado do seu corpo e sua energia vital. Quando o inconsciente produz imagens como as que apareceram, frequentemente está sinalizando áreas de tensão acumulada que não receberam atenção suficiente. Pode haver um esgotamento físico ou emocional que você está minimizando no cotidiano. A medicina integrativa reconhece a conexão profunda entre os padrões oníricos e a saúde do corpo: o sonho é, muitas vezes, o primeiro sinal de que algo precisa de cuidado. Prestar atenção a esse chamado agora pode prevenir desequilíbrios maiores no futuro.`;

const LOREM_UNIVERSO = `A mensagem final que o Universo quer te entregar através deste sonho é uma de esperança e direcionamento. Você não está sozinho nessa jornada — há uma inteligência maior operando nos bastidores da sua vida, orquestrando encontros, oportunidades e desafios que servem ao seu crescimento. Este sonho específico chegou justamente agora porque você está pronto para o próximo passo, mesmo que ainda não saiba qual é. Confie no processo. Confie nos sinais. E confie que o que emerge das profundezas da sua consciência durante o sono é uma das formas mais puras de orientação disponíveis ao ser humano.`;

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
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">

      {/* ── Header ── */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gold">
          🌙 Interpretação do Seu Sonho
        </h1>
        <p className="font-body text-text-muted text-sm">{dateFormatted}</p>
        <div className="flex justify-center">
          <Badge variant="outline">Interpretação Gratuita</Badge>
        </div>
      </div>

      {/* ── Card: Sonho original ── */}
      <div className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-5 space-y-2">
        <p className="font-body text-xs uppercase tracking-widest text-text-muted">
          Seu sonho
        </p>
        <DreamCollapse text={dream.description} />
      </div>

      {/* ── Card principal: análise + seções bloqueadas ── */}
      <div className="bg-mystic-elevated rounded-2xl border border-gold-subtle overflow-hidden">

        {/* Cabeçalho da seção */}
        <div className="flex items-center gap-2 px-6 pt-5 pb-4 border-b border-gold-subtle">
          <span className="text-gold text-base">✦</span>
          <p className="font-body text-xs uppercase tracking-[0.15em] text-text-muted font-semibold">
            Análise Completa
          </p>
        </div>

        {/* Análise gratuita — legível */}
        <div className="p-6">
          {dream.free_analysis ? (
            <AnalysisMarkdown content={dream.free_analysis} />
          ) : (
            <p className="font-body text-text-secondary text-center py-8">
              A interpretação ainda está sendo preparada...
            </p>
          )}
        </div>

        {/* ── Seções pagas + checkout sticky ── */}
        <div className="relative">

          {/* Seção 1 bloqueada — desfocada */}
          <div
            aria-hidden="true"
            className="px-6 pb-5 select-none pointer-events-none"
            style={{ filter: "blur(4px)", opacity: 0.35 }}
          >
            <h3 className="font-display text-xl font-semibold text-gold mb-3">
              O que a espiritualidade quer te dizer
            </h3>
            <p className="font-body text-text-secondary text-sm leading-relaxed">
              {LOREM_ESPIRITUALIDADE}
            </p>
          </div>

          {/* ── CHECKOUT BOX STICKY ── */}
          <div className="sticky top-20 z-20 px-4 pb-4">
            <div
              className="rounded-2xl border border-gold p-6 flex flex-col items-center gap-4"
              style={{
                background: "linear-gradient(135deg, #0f1226 0%, #0B0D1A 100%)",
                boxShadow: "0 0 40px rgba(212,168,67,0.18), 0 8px 40px rgba(0,0,0,0.6)",
              }}
            >
              <div className="text-center space-y-1">
                <p className="font-display text-xl font-bold text-text-primary">
                  🔓 Desbloquear Interpretação Completa
                </p>
                <p className="font-body text-text-secondary text-sm">
                  Seu sonho guarda muito mais do que foi revelado
                </p>
              </div>

              <CheckoutBox dreamId={params.id} />

              <p className="font-body text-text-muted text-xs text-center">
                🔒 Pagamento seguro &nbsp;•&nbsp; Resultado instantâneo
              </p>
            </div>
          </div>

          {/* Seções 2, 3 e 4 bloqueadas — desfocadas */}
          <div
            aria-hidden="true"
            className="px-6 pt-2 pb-8 select-none pointer-events-none space-y-7"
            style={{ filter: "blur(4px)", opacity: 0.35 }}
          >
            <div>
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                Seu sonho segundo a Psicologia
              </h3>
              <p className="font-body text-text-secondary text-sm leading-relaxed">
                {LOREM_PSICOLOGIA}
              </p>
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                Sobre a sua saúde
              </h3>
              <p className="font-body text-text-secondary text-sm leading-relaxed">
                {LOREM_SAUDE}
              </p>
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                Mensagem do Universo para você
              </h3>
              <p className="font-body text-text-secondary text-sm leading-relaxed">
                {LOREM_UNIVERSO}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Separador ── */}
      <div className="flex items-center justify-center gap-3 text-gold opacity-50 text-sm">
        <span>✦</span>
        <span>✦</span>
        <span>✦</span>
      </div>

      {/* ── Botão Rodapé ── */}
      <a
        href="/sonhos/analisar"
        className="block w-full text-center font-body font-semibold text-base border border-gold-subtle text-gold px-5 py-4 rounded-full hover:bg-gold hover:text-mystic-bg transition-all duration-200"
      >
        Interpretar Outro Sonho
      </a>

    </div>
  );
}
