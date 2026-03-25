import type { Metadata } from "next";
import { Badge } from "@/components/ui";
import { HeroForm } from "./HeroForm";
import { StepsCards } from "./StepsCards";
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
      <section id="hero-form" className="flex flex-col items-center text-center gap-6 md:pt-8">
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

        <StepsCards />
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
