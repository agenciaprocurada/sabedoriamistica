import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SIGNOS_ORDER, type Signo } from "@/data/horoscopo";
import { getHoroscopoDiario } from "@/lib/horoscopo";
import { HomeHoroscopo } from "./HomeHoroscopo";

export const metadata: Metadata = {
  title: "Sabedoria Mística | Portal de Autoconhecimento",
  description:
    "Interprete seus sonhos, consulte o Tarô e descubra seu horóscopo diário. Ferramentas gratuitas de autoconhecimento e sabedoria ancestral.",
};

const SERVICES = [
  {
    href: "/sonhos",
    icon: "🌙",
    label: "Analisador de Sonhos",
    badge: "GRÁTIS",
    description: "Descubra o significado oculto dos seus sonhos com inteligência artificial.",
    active: true,
    accent: "from-blue-500/10",
    border: "hover:border-blue-400/40",
  },
  {
    href: "/taro",
    icon: "🔮",
    label: "Tarot Online",
    badge: "Grátis",
    description: "Consulte os 22 Arcanos Maiores e descubra mensagens para seu caminho.",
    active: true,
    accent: "from-violet-500/10",
    border: "hover:border-violet-400/40",
  },
  {
    href: "/horoscopo-diario",
    icon: "⭐",
    label: "Horóscopo Diário",
    badge: "Atualiza todo dia",
    description: "O que os astros reservam para você hoje em amor, trabalho e energia.",
    active: true,
    accent: "from-amber-500/10",
    border: "hover:border-amber-400/40",
  },
  {
    href: "#",
    icon: "🔢",
    label: "Mapa Numerológico",
    badge: "Em breve",
    description: "Descubra o poder dos números em sua vida e destino.",
    active: false,
    accent: "from-emerald-500/5",
    border: "",
  },
  {
    href: "#",
    icon: "🧘",
    label: "Meditação Guiada",
    badge: "Em breve",
    description: "Práticas de meditação personalizadas para seu momento.",
    active: false,
    accent: "from-teal-500/5",
    border: "",
  },
  {
    href: "#",
    icon: "🌟",
    label: "Oráculo do Dia",
    badge: "Em breve",
    description: "Uma mensagem especial do universo para orientar seu dia.",
    active: false,
    accent: "from-rose-500/5",
    border: "",
  },
];

const CATEGORIES = [
  { label: "Astrologia", icon: "⭐" },
  { label: "Tarot", icon: "🔮" },
  { label: "Cristais", icon: "💎" },
  { label: "Meditação", icon: "🧘" },
  { label: "Numerologia", icon: "🔢" },
  { label: "Espiritualidade", icon: "🌟" },
];

const WISDOM_QUOTES = [
  { text: "O autoconhecimento é o início de toda sabedoria.", author: "Aristóteles" },
  { text: "Conhece-te a ti mesmo.", author: "Sócrates" },
  { text: "Aquele que conhece os outros é sábio. Aquele que se conhece é iluminado.", author: "Lao Tsé" },
  { text: "O caminho mais longo começa com um único passo interior.", author: "Sabedoria Ancestral" },
  { text: "Os sonhos são a linguagem da alma que o coração ainda não sabe falar.", author: "Sabedoria Mística" },
  { text: "As estrelas não guiam quem não quer ser guiado.", author: "Sabedoria Ancestral" },
  { text: "Em cada silêncio, o universo sussurra sua verdade.", author: "Sabedoria Mística" },
];

function getDailyWisdom(): { text: string; author: string } {
  const now = new Date();
  const idx = (now.getDate() + now.getMonth() + now.getFullYear()) % WISDOM_QUOTES.length;
  return WISDOM_QUOTES[idx];
}

export default async function HomePage() {
  // Auth (server-side)
  let userName: string | null = null;
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userName =
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        user.email?.split("@")[0] ??
        null;
    }
  } catch {
    // silencioso
  }

  // Horóscopo pré-calculado para todos os signos
  const today = new Date();
  const todayData = Object.fromEntries(
    SIGNOS_ORDER.map((s) => [s, getHoroscopoDiario(s as Signo, today)])
  ) as Record<Signo, ReturnType<typeof getHoroscopoDiario>>;

  const wisdom = getDailyWisdom();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">

      {/* ── Saudação ── */}
      <section className="text-center space-y-3">
        <div className="relative inline-block">
          <span className="absolute -top-4 -left-6 text-gold opacity-30 text-sm animate-pulse">✦</span>
          <span className="absolute -top-3 -right-5 text-gold opacity-20 text-xs animate-pulse" style={{ animationDelay: "0.5s" }}>✦</span>
          <span className="absolute -bottom-2 left-2 text-gold opacity-25 text-xs animate-pulse" style={{ animationDelay: "1s" }}>✦</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gold leading-tight">
            {userName ? `Olá, ${userName.split(" ")[0]}` : "Sabedoria Mística"}
          </h1>
        </div>
        <p className="font-body text-text-secondary text-sm md:text-base max-w-md mx-auto leading-relaxed">
          {userName
            ? "Bem-vindo de volta ao seu portal de autoconhecimento"
            : "Ferramentas gratuitas de autoconhecimento guiadas pela sabedoria ancestral"}
        </p>
        {!userName && (
          <div className="flex justify-center gap-3 text-gold/30 text-lg">
            <span>✦</span><span>✦</span><span>✦</span>
          </div>
        )}
      </section>

      {/* ── Serviços Populares ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gold-subtle" />
          <p className="font-body text-xs uppercase tracking-widest text-text-muted whitespace-nowrap">
            Serviços Populares
          </p>
          <div className="flex-1 h-px bg-gold-subtle" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SERVICES.map((svc) => {
            const card = (
              <div
                className={`
                  group relative rounded-2xl border border-gold-subtle p-4 overflow-hidden
                  transition-all duration-200
                  ${svc.active
                    ? `bg-mystic-elevated hover:shadow-[0_0_18px_rgba(212,175,55,0.1)] ${svc.border} cursor-pointer`
                    : "bg-mystic-bg/40 opacity-60 cursor-default"
                  }
                `}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${svc.accent} to-transparent pointer-events-none`} />
                <div className="relative space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{svc.icon}</span>
                      <h3 className="font-display text-sm font-semibold text-gold leading-tight">{svc.label}</h3>
                    </div>
                    <span className={`flex-shrink-0 font-body text-[10px] border rounded-full px-2 py-0.5 ${svc.active ? "border-gold-subtle text-text-muted" : "border-gold/10 text-gold/40"}`}>
                      {svc.badge}
                    </span>
                  </div>
                  <p className="font-body text-text-secondary text-xs leading-relaxed">
                    {svc.description}
                  </p>
                  {svc.active && (
                    <div className="flex items-center gap-1 text-gold font-body text-xs font-medium group-hover:gap-2 transition-all duration-200">
                      <span>Acessar</span>
                      <span>→</span>
                    </div>
                  )}
                </div>
              </div>
            );

            return svc.active ? (
              <Link key={svc.label} href={svc.href}>
                {card}
              </Link>
            ) : (
              <div key={svc.label}>{card}</div>
            );
          })}
        </div>
      </section>

      {/* ── Explorar por Categoria ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gold-subtle" />
          <p className="font-body text-xs uppercase tracking-widest text-text-muted whitespace-nowrap">
            Explore por Categoria
          </p>
          <div className="flex-1 h-px bg-gold-subtle" />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="flex items-center gap-1.5 bg-mystic-elevated border border-gold-subtle rounded-full px-4 py-2 font-body text-sm text-text-secondary"
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Seu Horóscopo ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gold-subtle" />
          <div className="flex items-center gap-2 px-1">
            <span className="text-lg">⭐</span>
            <p className="font-body text-xs uppercase tracking-widest text-text-muted whitespace-nowrap">
              Seu Horóscopo
            </p>
          </div>
          <div className="flex-1 h-px bg-gold-subtle" />
        </div>

        <div className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-5">
          <HomeHoroscopo todayData={todayData} />
        </div>

        <div className="text-center">
          <Link
            href="/horoscopo-diario"
            className="font-body text-xs text-text-muted hover:text-gold transition-colors"
          >
            Ver horóscopo completo →
          </Link>
        </div>
      </section>

      {/* ── Sabedoria do Dia ── */}
      <section>
        <div className="relative bg-mystic-elevated rounded-2xl border border-gold-subtle p-6 text-center overflow-hidden">
          {/* Decoração de fundo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[6rem] opacity-[0.03] leading-none">✦</span>
          </div>

          <div className="relative space-y-4">
            <div className="flex items-center justify-center gap-2 text-gold/60">
              <span className="text-xs">✦</span>
              <p className="font-body text-xs uppercase tracking-widest text-text-muted">Sabedoria do Dia</p>
              <span className="text-xs">✦</span>
            </div>

            <blockquote className="font-display text-lg md:text-xl text-text-primary leading-relaxed italic">
              &ldquo;{wisdom.text}&rdquo;
            </blockquote>

            <p className="font-body text-xs text-text-muted">— {wisdom.author}</p>
          </div>
        </div>
      </section>

    </div>
  );
}
