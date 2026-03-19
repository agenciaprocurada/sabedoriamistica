import type { Metadata } from "next";
import { Badge, Card } from "@/components/ui";
import { HeroForm } from "./HeroForm";

const PAGE_URL = "https://sabedoriamistica.com.br/sonhos";
const OG_DESCRIPTION =
  "Descubra o significado profundo dos seus sonhos. Interpretação personalizada com simbologia e arquétipos.";

export const metadata: Metadata = {
  title: "Significado dos Sonhos — Descubra o que seu sonho quer dizer | Sabedoria Mística",
  description: OG_DESCRIPTION,
  keywords:
    "significado dos sonhos, sonhei com, interpretação de sonhos, o que significa sonhar",
  openGraph: {
    title: "Descubra o que o Universo está Tentando lhe Dizer",
    description: OG_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Sabedoria Mística",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Descubra o que o Universo está Tentando lhe Dizer",
    description: OG_DESCRIPTION,
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

const steps = [
  {
    emoji: "🌙",
    title: "Descreva seu sonho",
    description: "Conte com o máximo de detalhes tudo que você viveu enquanto dormia.",
  },
  {
    emoji: "🔮",
    title: "Interpretação profunda",
    description:
      "Especialistas em simbologia e sabedoria ancestral analisam cada detalhe, símbolo e emoção presente no seu sonho.",
  },
  {
    emoji: "✨",
    title: "Receba sua análise",
    description:
      "Descubra as mensagens ocultas, arquétipos e orientações que seu inconsciente está revelando para sua vida.",
  },
];

const testimonials = [
  {
    name: "Mariana S.",
    location: "São Paulo, SP",
    text: "Sonhei repetidamente com água turva por semanas. A interpretação me ajudou a entender que estava evitando uma conversa difícil no trabalho. Depois da análise, tive coragem de agir.",
  },
  {
    name: "Ricardo O.",
    location: "Belo Horizonte, MG",
    text: "Fiquei impressionado com a profundidade da análise. Meu sonho sobre voar estava ligado a uma decisão que eu precisava tomar. A interpretação foi cirúrgica e muito precisa.",
  },
  {
    name: "Fernanda L.",
    location: "Curitiba, PR",
    text: "Uso toda semana. Os sonhos têm me guiado em momentos de dúvida. Sinto que finalmente entendo a linguagem que minha alma usa para falar comigo enquanto durmo.",
  },
];

function Stars() {
  return (
    <span className="text-gold text-base leading-none" aria-label="5 estrelas">
      ★★★★★
    </span>
  );
}

function MoonIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M40 8C22.3 8 8 22.3 8 40C8 57.7 22.3 72 40 72C35 62 32 51 32 40C32 29 35 18 40 8Z"
        fill="#D4A843"
        opacity="0.9"
      />
      <path
        d="M40 8C22.3 8 8 22.3 8 40C8 57.7 22.3 72 40 72C35 62 32 51 32 40C32 29 35 18 40 8Z"
        fill="url(#moon-gradient)"
      />
      <circle
        cx="40"
        cy="40"
        r="32"
        stroke="#D4A843"
        strokeWidth="1"
        strokeOpacity="0.25"
        strokeDasharray="5 5"
      />
      {/* Estrelinhas decorativas */}
      <circle cx="58" cy="18" r="1.5" fill="#E8C66A" opacity="0.8" />
      <circle cx="65" cy="35" r="1" fill="#E8C66A" opacity="0.6" />
      <circle cx="54" cy="54" r="1.5" fill="#E8C66A" opacity="0.7" />
      <circle cx="20" cy="22" r="1" fill="#E8C66A" opacity="0.5" />
      <defs>
        <linearGradient id="moon-gradient" x1="8" y1="8" x2="40" y2="72" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8C66A" />
          <stop offset="1" stopColor="#A07D2E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function SonhosPage() {
  return (
    <div className="space-y-24 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center gap-6 pt-8">
        <MoonIcon />

        <Badge variant="solid">✨ Interpretação Gratuita</Badge>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight max-w-3xl text-balance">
          Descubra o que o{" "}
          <span className="text-gold">Universo</span> está Tentando lhe Dizer
        </h1>

        <p className="font-body text-text-secondary text-lg md:text-xl max-w-2xl leading-relaxed">
          Cada sonho carrega mensagens profundas do seu inconsciente. Nossa
          interpretação revela os símbolos, emoções e orientações ocultas nos
          seus sonhos.
        </p>

        <HeroForm />
      </section>

      {/* ── Como Funciona ── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
            Como funciona
          </h2>
          <p className="font-body text-text-secondary">
            Simples, profundo e transformador
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <Card key={i} hover className="relative flex flex-col gap-4">
              {/* Número do passo */}
              <span
                className="absolute -top-3 -left-3 h-7 w-7 rounded-full bg-gold text-mystic-bg font-body font-bold text-xs flex items-center justify-center shadow-gold"
              >
                {i + 1}
              </span>

              <span className="text-4xl">{step.emoji}</span>

              <h3 className="font-display text-xl font-semibold text-gold">
                {step.title}
              </h3>

              <p className="font-body text-text-secondary text-sm leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Prova Social ── */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <p className="font-body text-text-secondary text-sm uppercase tracking-widest">
            Transformando vidas
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
            Mais de{" "}
            <span className="text-gold">2.847 sonhos</span>{" "}
            já interpretados
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={i} className="flex flex-col gap-4">
              <Stars />

              <p className="font-accent italic text-text-secondary text-base leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="border-t border-gold-subtle pt-4">
                <p className="font-body text-text-primary text-sm font-medium">
                  {t.name}
                </p>
                <p className="font-body text-text-muted text-xs">{t.location}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-10 md:p-16 flex flex-col items-center text-center gap-6">
        <Badge variant="outline">Comece agora</Badge>

        <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary max-w-xl text-balance">
          Seu sonho tem uma mensagem esperando por você
        </h2>

        <a
          href="/sonhos/analisar"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gold hover:bg-gold-light text-mystic-bg font-body font-semibold text-lg px-10 py-4 shadow-gold hover:shadow-gold-lg transition-all duration-200"
        >
          Interpretar Meu Sonho Agora
        </a>

        <p className="font-body text-text-muted text-sm">
          100% gratuito &nbsp;•&nbsp; Resultado instantâneo &nbsp;•&nbsp; Interpretação personalizada
        </p>
      </section>

    </div>
  );
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sabedoria Mística — Interpretação de Sonhos",
  url: "https://sabedoriamistica.com.br/sonhos",
  description:
    "Descubra o significado profundo dos seus sonhos. Interpretação personalizada com simbologia e arquétipos.",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
    description: "Interpretação gratuita de sonhos",
  },
  inLanguage: "pt-BR",
};
