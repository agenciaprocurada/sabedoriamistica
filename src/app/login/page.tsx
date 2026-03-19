import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Entrar | Sabedoria Mística",
  description: "Acesse o portal e conecte-se com sua jornada de autoconhecimento.",
};

interface LoginPageProps {
  searchParams: { redirect?: string };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectTo = searchParams.redirect ?? "/";

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12">

      {/* Ícone decorativo */}
      <div className="mb-6">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path
            d="M24 4C13 4 4 13 4 24C4 35 13 44 24 44C20 38 18 31 18 24C18 17 20 10 24 4Z"
            fill="#D4A843"
            opacity="0.9"
          />
          <circle cx="24" cy="24" r="20" stroke="#D4A843" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Título — Server-rendered */}
      <h1 className="font-display text-3xl md:text-4xl font-bold text-gold mb-2 text-center">
        Entre no Portal
      </h1>
      <p className="font-body text-text-secondary text-center mb-8 max-w-xs">
        Acesse sua jornada de autoconhecimento e sabedoria ancestral.
      </p>

      {/* Form — Client Component */}
      <LoginForm redirectTo={redirectTo} />

    </div>
  );
}
