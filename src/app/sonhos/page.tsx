import type { Metadata } from "next";
import { Badge, Card } from "@/components/ui";
import { HeroForm } from "./HeroForm";
import { TestimonialsCarousel } from "./TestimonialsCarousel";
import { CtaButton } from "./CtaButton";

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
    <div className="space-y-24 pb-8 md:py-8 -mt-5 md:mt-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center gap-6 md:pt-8">
        <div className="hidden md:block">
          <MoonIcon />
        </div>

        <Badge variant="solid">✨ Interpretação Gratuita</Badge>

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

        <TestimonialsCarousel />
      </section>

      {/* ── CTA Final ── */}
      <section className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-10 md:p-16 flex flex-col items-center text-center gap-6">
        <Badge variant="outline">Comece agora</Badge>

        <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary max-w-xl text-balance">
          Seu sonho tem uma mensagem esperando por você
        </h2>

        <CtaButton />

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
