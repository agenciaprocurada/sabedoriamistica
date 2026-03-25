"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MysticLoader } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { LoginModal } from "@/components/LoginModal";

const MAX_CHARS = 1200;

const LOADING_MESSAGES = [
  "Consultando o dicionário de sonhos...",
  "Identificando os símbolos do seu sonho...",
  "Analisando emoções e padrões ocultos...",
  "Conectando os elementos do sonho...",
  "Preparando sua interpretação personalizada...",
];

function AnalysisLoader() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + 1.2;
      });
    }, 80);
    return () => clearInterval(progressTimer);
  }, []);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
        setFade(true);
      }, 300);
    }, 2200);
    return () => clearInterval(msgTimer);
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-8 py-4 animate-fadeIn">
      <MysticLoader size={64} text="" />
      <div className="w-full space-y-3">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p
          className="font-body text-sm text-center text-text-secondary transition-opacity duration-300"
          style={{ opacity: fade ? 1 : 0 }}
        >
          {LOADING_MESSAGES[msgIndex]}
        </p>
      </div>
      <div className="text-center space-y-1">
        <p className="font-display text-xl text-gold">Seu sonho está sendo analisado</p>
        <p className="font-body text-xs text-text-muted">Isso leva apenas alguns segundos</p>
      </div>
    </div>
  );
}

export function HeroForm() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [dream, setDream] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Expõe o textarea para o CTA externo via id
  const TEXTAREA_ID = "dream-textarea";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dream.trim()) {
      alert("⚠️ Por favor, descreva seu sonho antes de continuar.");
      textareaRef.current?.focus();
      return;
    }

    sessionStorage.setItem("pendingDream", dream.trim());

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      setLoading(true);
      router.push("/sonhos/analisar");
    } else {
      setShowLoginModal(true);
    }
  }

  function handleLoginSuccess() {
    setShowLoginModal(false);
    setLoading(true);
    router.push("/sonhos/analisar");
  }

  const remaining = MAX_CHARS - dream.length;
  const isNearLimit = remaining <= 150;
  const isAtLimit = remaining <= 0;

  if (loading) return <AnalysisLoader />;

  return (
    <>
      {showLoginModal && (
        <LoginModal
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
          redirectTo="/sonhos/analisar"
        />
      )}
      <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-5">
          {/* Card header */}
          <div className="space-y-1">
            <h2 className="font-display text-base md:text-xl text-text-primary font-semibold">
              Descreva seu sonho com detalhes
            </h2>
            <p className="font-body text-text-secondary text-sm">
              Quanto mais detalhes você incluir, mais precisa será a interpretação.
            </p>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              id={TEXTAREA_ID}
              ref={textareaRef}
              value={dream}
              onChange={(e) => setDream(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Conte seu sonho aqui... ex: Estava voando sobre o mar quando de repente..."
              rows={5}
              className="w-full bg-black/20 border border-gold/30 rounded-xl p-4 pb-8 font-body text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-gold transition-colors duration-200"
            />
            {/* Contador */}
            <span
              className={`absolute bottom-3 right-4 font-body text-xs transition-colors duration-200 ${
                isAtLimit
                  ? "text-red-400"
                  : isNearLimit
                  ? "text-amber-400"
                  : "text-text-muted"
              }`}
            >
              {dream.length}/{MAX_CHARS.toLocaleString("pt-BR")}
            </span>
          </div>

          {/* Footer */}
          <div className="space-y-3 pt-1 border-t border-gold-subtle">
            <p className="font-body text-text-muted text-xs text-center">
              100% gratuito&nbsp;•&nbsp;Resultado instantâneo&nbsp;•&nbsp;Interpretação personalizada
            </p>
            <button
              type="submit"
              className="w-full font-body font-bold text-base text-mystic-bg py-4 rounded-full transition-all duration-200 bg-gold hover:bg-gold-light shadow-gold hover:shadow-gold-lg animate-pulse-subtle"
            >
              INTERPRETAR MEU SONHO AGORA
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
