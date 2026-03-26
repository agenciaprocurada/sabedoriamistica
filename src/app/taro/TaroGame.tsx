"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { shuffleDeck, type TaroCard, type Purpose } from "@/data/taro";
import { createClient } from "@/lib/supabase/client";
import { PurposeStep } from "./PurposeStep";
import { CardTable } from "./CardTable";
import { ReadingResult } from "./ReadingResult";
import { LoginModal } from "@/components/LoginModal";

// Tipagem global para o clarity
declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

type Stage = "purpose" | "table" | "auth" | "result";

const PURPOSE_LABEL: Record<Purpose, string> = {
  general: "Geral",
  love: "Amor",
  work: "Trabalho",
  spiritual: "Espiritual",
};

const SESSION_KEY = "pendingTaro";

interface SavedState {
  purpose: Purpose;
  past: TaroCard;
  present: TaroCard;
  future: TaroCard;
}

interface SelectedCards {
  past: TaroCard | null;
  present: TaroCard | null;
  future: TaroCard | null;
}

async function fetchUserName(): Promise<string> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "";
  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();
  return profile?.name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "";
}

// Mapa de estágio para título de página virtual no Clarity
const STAGE_PAGE: Record<Stage, string> = {
  purpose: "/taro/escolha-proposito",
  table:   "/taro/escolha-cartas",
  auth:    "/taro/login-necessario",
  result:  "/taro/resultado",
};

export function TaroGame() {
  const [stage, setStage] = useState<Stage>("purpose");
  const [userName, setUserName] = useState("");
  const [purpose, setPurpose] = useState<Purpose | null>(null);
  const [deck, setDeck] = useState<TaroCard[]>(() => shuffleDeck());
  const [cards, setCards] = useState<SelectedCards>({ past: null, present: null, future: null });
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Rastreia mudanças de estágio como páginas virtuais no Clarity
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.clarity === "function") {
      window.clarity("set", "virtualUrl", STAGE_PAGE[stage]);
      window.clarity("set", "pageTitle", `Tarô — ${stage}`);
    }
  }, [stage]);

  // Busca nome do usuário logado ao montar
  useEffect(() => {
    fetchUserName().then((name) => { if (name) setUserName(name); });
  }, []);

  // Restaura estado após Google OAuth
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (!saved) return;

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        try {
          const data: SavedState = JSON.parse(saved);
          const name = await fetchUserName();
          setUserName(name);
          setPurpose(data.purpose);
          setCards({ past: data.past, present: data.present, future: data.future });
          setStage("result");
          sessionStorage.removeItem(SESSION_KEY);
        } catch {
          sessionStorage.removeItem(SESSION_KEY);
        }
      }
    });
  }, []);

  function handleStart(p: Purpose) {
    setPurpose(p);
    setDeck(shuffleDeck());
    setStage("table");
  }

  const handleCardsComplete = useCallback(
    async (selected: SelectedCards) => {
      setCards(selected);

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setStage("result");
      } else {
        const saved: SavedState = {
          purpose: purpose!,
          past: selected.past!,
          present: selected.present!,
          future: selected.future!,
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(saved));
        setStage("auth");
      }
    },
    [purpose]
  );

  async function handleLoginSuccess() {
    setShowLoginModal(false);
    const name = await fetchUserName();
    if (name) setUserName(name);
    setStage("result");
    sessionStorage.removeItem(SESSION_KEY);
  }

  function handleReshuffle() {
    setDeck(shuffleDeck());
    setCards({ past: null, present: null, future: null });
  }

  function handleNewReading() {
    setDeck(shuffleDeck());
    setCards({ past: null, present: null, future: null });
    setStage("table");
  }

  function handleChangePurpose() {
    setCards({ past: null, present: null, future: null });
    setStage("purpose");
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {showLoginModal && (
        <LoginModal
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
          redirectTo="/taro"
        />
      )}

      <AnimatePresence mode="wait">
        {/* Etapa 1 — Propósito */}
        {stage === "purpose" && (
          <motion.div key="purpose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-6 sm:p-8">
              <PurposeStep onStart={handleStart} />
            </div>
          </motion.div>
        )}

        {/* Etapa 2+3 — Mesa de jogo */}
        {stage === "table" && (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-4 sm:p-6">
              <CardTable
                userName={userName}
                purposeLabel={PURPOSE_LABEL[purpose!]}
                deck={deck}
                onComplete={handleCardsComplete}
                onBack={() => setStage("purpose")}
                onReshuffle={handleReshuffle}
              />
            </div>
          </motion.div>
        )}

        {/* Etapa 4 — Gate de autenticação */}
        {stage === "auth" && cards.past && cards.present && cards.future && (
          <motion.div key="auth" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-mystic-elevated rounded-2xl border border-gold-subtle overflow-hidden">
              {/* Preview das cartas com blur */}
              <div className="relative p-6">
                <div className="grid grid-cols-3 gap-3 filter blur-[2px] opacity-60 pointer-events-none select-none">
                  {[cards.past, cards.present, cards.future].map((card, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <p className="font-body text-xs text-gold/60 uppercase">
                        {["Passado", "Presente", "Futuro"][i]}
                      </p>
                      <img src={card!.image} alt="" className="w-full rounded-lg border border-gold/20" />
                    </div>
                  ))}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-mystic-elevated via-mystic-elevated/80 to-transparent">
                  <div className="text-center space-y-3 max-w-sm">
                    <p className="text-3xl">🔮</p>
                    <h3 className="font-display text-xl font-bold text-gold">
                      Sua leitura está pronta!
                    </h3>
                    <p className="font-body text-sm text-text-secondary">
                      Para que as cartas completem sua mensagem, entre com sua conta gratuita.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões de login */}
              <div className="p-6 pt-2 space-y-3">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full bg-gold hover:bg-gold-light text-mystic-bg font-body font-semibold py-3.5 rounded-full shadow-gold transition-all"
                >
                  ✦ Criar Conta Gratuita
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full border border-gold-subtle text-gold hover:bg-gold/5 font-body text-sm py-3 rounded-full transition-colors"
                >
                  Já tenho conta — Entrar
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Etapa 5 — Resultado */}
        {stage === "result" && cards.past && cards.present && cards.future && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-mystic-elevated rounded-2xl border border-gold-subtle p-5 sm:p-7">
              <ReadingResult
                userName={userName}
                purpose={purpose!}
                past={cards.past}
                present={cards.present}
                future={cards.future}
                onNewReading={handleNewReading}
                onChangePurpose={handleChangePurpose}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
