"use client";

/**
 * ClarityEvent
 *
 * Componente leve para disparar um evento customizado no Microsoft Clarity
 * quando uma página ou etapa importante é exibida.
 *
 * Usa polling para aguardar o Clarity estar disponível caso haja algum
 * delay no carregamento do script.
 *
 * Uso: <ClarityEvent name="sonhos_resultado" />
 */

import { useEffect } from "react";

declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

interface Props {
  /** Nome do evento que aparecerá nos relatórios do Clarity */
  name: string;
  /** URL virtual opcional — agrupa IDs dinâmicos em uma única linha do relatório */
  virtualUrl?: string;
}

export function ClarityEvent({ name, virtualUrl }: Props) {
  useEffect(() => {
    let attempts = 0;
    const MAX_ATTEMPTS = 30; // até 3 segundos (30 × 100ms)

    const tryFire = () => {
      if (typeof window.clarity === "function") {
        if (virtualUrl) {
          window.clarity("set", "virtualUrl", virtualUrl);
        }
        window.clarity("event", name);
        return;
      }

      if (attempts < MAX_ATTEMPTS) {
        attempts++;
        setTimeout(tryFire, 100);
      }
    };

    tryFire();
  }, [name, virtualUrl]);

  return null;
}
