import type { Metadata } from "next";
import Link from "next/link";
import { HeroForm } from "@/app/sonhos/HeroForm";

export const metadata: Metadata = {
  title: "Sabedoria Mística | Autoconhecimento e Sabedoria Ancestral",
  description:
    "Interprete seus sonhos, consulte o Tarô e descubra seu horóscopo diário. Ferramentas gratuitas de autoconhecimento e sabedoria ancestral.",
};

const TOOLS = [
  {
    href: "/taro",
    icon: "🔮",
    label: "Jogo de Tarô",
    badge: "Grátis",
    description:
      "Consulte os 22 Arcanos Maiores. Escolha suas cartas e revele as mensagens do passado, presente e futuro.",
    cta: "Iniciar Consulta",
    accent: "from-violet-500/10",
    border: "hover:border-violet-400/40",
  },
  {
    href: "/horoscopo-diario",
    icon: "⭐",
    label: "Horóscopo Diário",
    badge: "Atualiza todo dia",
    description:
      "Descubra o que os astros reservam para você hoje em amor, trabalho e energia.",
    cta: "Ver Horóscopo",
    accent: "from-amber-500/10",
    border: "hover:border-amber-400/40",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16 py-8">

      {/* ── Hero ── */}
      <section className="text-center space-y-4 px-4">
        <div className="relative inline-block">
          <span className="absolute -top-4 -left-6 text-gold opacity-30 text-sm animate-pulse">✦</span>
          <span className="absolute -top-3 -right-5 text-gold opacity-20 text-xs animate-pulse" style={{ animationDelay: "0.5s" }}>✦</span>
          <span className="absolute -bottom-2 left-2 text-gold opacity-25 text-xs animate-pulse" style={{ animationDelay: "1s" }}>✦</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gold leading-tight">
            Sabedoria Mística
          </h1>
        </div>
        <p className="font-body text-text-secondary text-base md:text-lg max-w-md mx-auto leading-relaxed">
          Ferramentas gratuitas de autoconhecimento guiadas pela sabedoria ancestral
        </p>
        <div className="flex justify-center gap-3 text-gold/30 text-lg">
          <span>✦</span><span>✦</span><span>✦</span>
        </div>
      </section>

      {/* ── Interpretador de Sonhos (destaque) ── */}
      <section className="max-w-2xl mx-auto px-4 space-y-5">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🌙</span>
            <h2 className="font-display text-2xl font-bold text-gold">Interpretador de Sonhos</h2>
          </div>
          <p className="font-body text-text-secondary text-sm">
            Descreva seu sonho e descubra o que ele quer te dizer
          </p>
          <span className="inline-block bg-gold/10 border border-gold/20 text-gold text-xs font-body px-3 py-0.5 rounded-full">
            Grátis • Resultado em segundos
          </span>
        </div>
        <HeroForm />
      </section>

      {/* ── Outras ferramentas ── */}
      <section className="max-w-2xl mx-auto px-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gold-subtle" />
          <p className="font-body text-xs uppercase tracking-widest text-text-muted whitespace-nowrap">
            Mais ferramentas
          </p>
          <div className="flex-1 h-px bg-gold-subtle" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`
                group relative bg-mystic-elevated rounded-2xl border border-gold-subtle p-5
                transition-all duration-200 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]
                ${tool.border} overflow-hidden
              `}
            >
              {/* Gradiente de fundo decorativo */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.accent} to-transparent pointer-events-none`} />

              <div className="relative space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tool.icon}</span>
                    <h3 className="font-display text-lg font-semibold text-gold">{tool.label}</h3>
                  </div>
                  <span className="flex-shrink-0 font-body text-xs text-text-muted border border-gold-subtle rounded-full px-2 py-0.5">
                    {tool.badge}
                  </span>
                </div>

                <p className="font-body text-text-secondary text-sm leading-relaxed">
                  {tool.description}
                </p>

                <div className="flex items-center gap-1.5 text-gold font-body text-sm font-medium group-hover:gap-2.5 transition-all duration-200">
                  <span>{tool.cta}</span>
                  <span className="text-xs">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Rodapé de confiança ── */}
      <section className="text-center pb-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-body text-xs text-text-muted">
          <span>✦ 100% gratuito</span>
          <span>✦ Sem anúncios invasivos</span>
          <span>✦ Baseado em sabedoria ancestral</span>
        </div>
      </section>

    </div>
  );
}
