"use client";

/**
 * ClarityPageView
 *
 * Rastreia mudanças de rota no Next.js App Router e notifica o Microsoft Clarity
 * para que cada página seja registrada corretamente nos relatórios.
 *
 * Como o App Router não expõe um evento de "route change" simples via hook,
 * usamos o pathname do next/navigation para detectar mudanças de URL.
 */

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Tipagem global para o clarity
declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

export function ClarityPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.clarity !== "function") return;

    // Monta a URL completa com query string
    const search = searchParams.toString();
    const fullUrl = search ? `${pathname}?${search}` : pathname;

    // Identifica a página virtual no Clarity
    window.clarity("set", "pageTitle", document.title);
    window.clarity("set", "virtualUrl", fullUrl);
  }, [pathname, searchParams]);

  return null;
}
