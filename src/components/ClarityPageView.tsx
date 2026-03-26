"use client";

/**
 * ClarityPageView
 *
 * Rastreia mudanças de rota no Next.js App Router e notifica o Microsoft Clarity
 * para que cada página seja registrada corretamente nos relatórios.
 *
 * Usa polling para aguardar o Clarity estar disponível.
 */

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

export function ClarityPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.toString();
    const fullUrl = search ? `${pathname}?${search}` : pathname;
    const title = document.title;

    let attempts = 0;
    const MAX_ATTEMPTS = 30; // até 3 segundos (30 × 100ms)

    const tryTrack = () => {
      if (typeof window.clarity === "function") {
        window.clarity("set", "pageTitle", title);
        window.clarity("set", "virtualUrl", fullUrl);
        return;
      }

      if (attempts < MAX_ATTEMPTS) {
        attempts++;
        setTimeout(tryTrack, 100);
      }
    };

    tryTrack();
  }, [pathname, searchParams]);

  return null;
}
