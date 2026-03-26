"use client";

/**
 * ClarityEvent
 *
 * Componente leve para disparar um evento customizado no Microsoft Clarity
 * quando uma página ou etapa importante é exibida.
 *
 * Uso: <ClarityEvent name="sonhos_resultado" />
 */

import { useEffect } from "react";

// Tipagem global para window.clarity (caso não declarada ainda)
declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

interface Props {
  /** Nome do evento que aparecerá nos relatórios do Clarity */
  name: string;
  /** URL virtual opcional — sobrescreve a URL registrada no Clarity */
  virtualUrl?: string;
}

export function ClarityEvent({ name, virtualUrl }: Props) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.clarity !== "function") return;

    // Dispara o evento nomeado
    window.clarity("event", name);

    // Se uma URL virtual for informada, usa ela como referência da página
    if (virtualUrl) {
      window.clarity("set", "virtualUrl", virtualUrl);
    }
  }, [name, virtualUrl]);

  return null;
}
