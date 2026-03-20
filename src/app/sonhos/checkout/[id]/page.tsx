"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

const POLL_INTERVAL = 3000;
const MAX_POLLS = 40; // 2 min

function formatCountdown(expiresAt: string) {
  const diff = Math.max(0, new Date(expiresAt).getTime() - Date.now());
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const dreamId = params.id as string;

  const [phase, setPhase] = useState<"loading" | "pix" | "paid" | "error">("loading");
  const [pixData, setPixData] = useState<{
    pixId: string;
    brCode: string | null;
    brCodeBase64: string;
    expiresAt: string;
    amount: number;
    devMode: boolean;
  } | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState("");
  const pollCount = useRef(0);
  const started = useRef(false);

  // Cria o PIX ao montar
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        const res = await fetch("/api/pagamentos/criar-pix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dreamId }),
        });
        const data = await res.json();

        if (res.ok && data.pixId) {
          setPixData(data);
          setPhase("pix");
        } else if (res.status === 422 && data.redirect) {
          router.push(`${data.redirect}?next=/sonhos/checkout/${dreamId}`);
        } else {
          setErrorMsg(data.error || "Não foi possível gerar o PIX.");
          setPhase("error");
        }
      } catch {
        setErrorMsg("Erro de conexão. Tente novamente.");
        setPhase("error");
      }
    })();
  }, [dreamId, router]);

  // Countdown
  useEffect(() => {
    if (!pixData?.expiresAt) return;
    setCountdown(formatCountdown(pixData.expiresAt));
    const t = setInterval(() => setCountdown(formatCountdown(pixData.expiresAt)), 1000);
    return () => clearInterval(t);
  }, [pixData?.expiresAt]);

  // Polling de status do PIX
  const startPolling = useCallback(() => {
    if (!pixData) return;

    const poll = async () => {
      pollCount.current += 1;

      const res = await fetch("/api/pagamentos/verificar-pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dreamId, pixId: pixData.pixId }),
      });
      const data = await res.json();

      if (data.isPaid) {
        setPhase("paid");
        setTimeout(() => router.push(`/sonhos/completo/${dreamId}`), 1500);
        return;
      }

      if (pollCount.current < MAX_POLLS) {
        setTimeout(poll, POLL_INTERVAL);
      }
    };

    setTimeout(poll, POLL_INTERVAL);
  }, [pixData, dreamId, router]);

  useEffect(() => {
    if (phase === "pix" && pixData) startPolling();
  }, [phase, pixData, startPolling]);

  async function simulatePayment() {
    if (!pixData || simulating) return;
    setSimulating(true);
    try {
      await fetch("/api/pagamentos/simular-pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pixId: pixData.pixId }),
      });
    } finally {
      setSimulating(false);
    }
  }

  async function copyCode() {
    if (!pixData?.brCode) return;
    await navigator.clipboard.writeText(pixData.brCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  // ── LOADING ─────────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div className="max-w-md mx-auto py-20 flex flex-col items-center gap-6 text-center px-6">
        <div className="relative flex items-center justify-center w-16 h-16">
          <span className="absolute inset-0 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
          <span className="text-gold text-xl">✦</span>
        </div>
        <p className="font-display text-xl text-gold animate-pulse">Gerando PIX...</p>
      </div>
    );
  }

  // ── ERRO ─────────────────────────────────────────────────────────────────
  if (phase === "error") {
    return (
      <div className="max-w-md mx-auto py-16 flex flex-col items-center gap-6 text-center px-6">
        <p className="text-3xl">⚠️</p>
        <p className="font-body text-text-secondary">{errorMsg}</p>
        <button
          onClick={() => {
            started.current = false;
            pollCount.current = 0;
            setPhase("loading");
            setErrorMsg("");
          }}
          className="font-body text-sm bg-gold hover:bg-gold-light text-mystic-bg px-6 py-3 rounded-full transition-colors"
        >
          Tentar novamente
        </button>
        <a href={`/sonhos/resultado/${dreamId}`} className="font-body text-xs text-text-muted hover:text-text-secondary transition-colors">
          Voltar ao resultado
        </a>
      </div>
    );
  }

  // ── PAGO ─────────────────────────────────────────────────────────────────
  if (phase === "paid") {
    return (
      <div className="max-w-md mx-auto py-20 flex flex-col items-center gap-6 text-center px-6">
        <div className="text-5xl">✅</div>
        <p className="font-display text-2xl text-gold">Pagamento confirmado!</p>
        <p className="font-body text-text-secondary text-sm">Redirecionando para sua interpretação...</p>
      </div>
    );
  }

  // ── PIX CHECKOUT ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto py-8 px-4 space-y-6">

      {/* Header */}
      <div className="text-center space-y-1">
        <p className="font-body text-xs uppercase tracking-widest text-text-muted">Pagamento via PIX</p>
        <h1 className="font-display text-2xl text-gold">Interpretação Completa</h1>
        <p className="font-display text-3xl font-bold text-gold">R$ 9,90</p>
      </div>

      {/* Card QR code */}
      <div className="bg-mystic-elevated border border-gold-subtle rounded-2xl p-6 flex flex-col items-center gap-5">

        {/* QR Code */}
        {pixData?.brCodeBase64 && (
          <div className="bg-white p-3 rounded-xl shadow-gold">
            <img
              src={pixData.brCodeBase64}
              alt="QR Code PIX"
              className="w-52 h-52 object-contain"
            />
          </div>
        )}

        {/* Instruções */}
        <ol className="font-body text-text-secondary text-sm space-y-1 text-left w-full list-decimal list-inside">
          <li>Abra o app do seu banco</li>
          <li>Escolha <strong className="text-text-primary">Pagar com PIX</strong></li>
          <li>Escaneie o QR code ou copie o código</li>
        </ol>

        {/* Botão copiar código */}
        {pixData && (
          <button
            onClick={copyCode}
            disabled={!pixData.brCode}
            className="w-full flex items-center justify-center gap-2 font-body text-sm font-semibold border border-gold text-gold hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded-full transition-colors duration-200"
          >
            {copied ? (
              <>
                <span>✓</span> Código copiado!
              </>
            ) : (
              <>
                <span>📋</span> Copiar código PIX
              </>
            )}
          </button>
        )}


        {/* Status + countdown */}
        <div className="w-full space-y-3 pt-2 border-t border-gold-subtle">
          <div className="flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <p className="font-body text-text-secondary text-sm">Aguardando pagamento...</p>
          </div>
          {countdown && countdown !== "0:00" && (
            <p className="font-body text-xs text-center text-text-muted">
              Expira em <span className="text-gold font-medium">{countdown}</span>
            </p>
          )}
        </div>
      </div>

      {/* Rodapé */}
      <div className="text-center space-y-3">
        <p className="font-body text-xs text-text-muted">
          🔒 Pagamento seguro &nbsp;•&nbsp; PIX processado pela AbacatePay
        </p>
        <a href={`/sonhos/resultado/${dreamId}`} className="font-body text-xs text-text-muted hover:text-text-secondary transition-colors underline">
          Voltar ao resultado
        </a>
      </div>

    </div>
  );
}
