"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { MysticLoader } from "@/components/ui";

export default function CheckoutPage() {
  const params = useParams();
  const dreamId = params.id as string;
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        const res = await fetch("/api/pagamentos/criar-cobranca", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dreamId }),
        });
        const data = await res.json();

        if (res.ok && data.billingUrl) {
          window.location.href = data.billingUrl;
        } else if (res.status === 422 && data.redirect) {
          // Dados de pagamento faltando → redireciona para meus dados
          window.location.href = `${data.redirect}?next=/sonhos/checkout/${dreamId}`;
        } else {
          setError(data.error || "Não foi possível iniciar o pagamento.");
        }
      } catch {
        setError("Erro de conexão. Verifique sua internet e tente novamente.");
      }
    })();
  }, [dreamId]);

  if (error) {
    return (
      <div className="max-w-md mx-auto py-16 flex flex-col items-center gap-6 text-center">
        <p className="text-2xl">⚠️</p>
        <p className="font-body text-text-secondary">{error}</p>
        <button
          onClick={() => {
            started.current = false;
            setError(null);
          }}
          className="font-body text-sm bg-gold hover:bg-gold-light text-mystic-bg px-6 py-3 rounded-full transition-colors"
        >
          Tentar novamente
        </button>
        <a
          href={`/sonhos/resultado/${dreamId}`}
          className="font-body text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          Voltar ao resultado
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16 flex flex-col items-center gap-6 text-center">
      <MysticLoader size={64} text="" />
      <p className="font-display text-xl text-gold animate-pulse">
        Preparando seu acesso...
      </p>
      <p className="font-body text-text-secondary text-sm max-w-xs">
        Você será redirecionado para o pagamento em instantes.
      </p>
    </div>
  );
}
