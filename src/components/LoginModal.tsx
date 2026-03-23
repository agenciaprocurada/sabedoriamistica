"use client";

import { useEffect } from "react";
import { LoginForm } from "@/app/login/LoginForm";

interface LoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
  redirectTo?: string;
}

export function LoginModal({ onSuccess, onClose, redirectTo = "/sonhos/analisar" }: LoginModalProps) {
  // Fecha com ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-mystic-elevated border border-gold-subtle rounded-2xl p-8 shadow-2xl">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors text-lg leading-none"
          aria-label="Fechar"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6 space-y-1">
          <p className="font-display text-2xl text-gold">🌙 Quase lá</p>
          <p className="font-body text-sm text-text-secondary">
            Entre para ver a interpretação do seu sonho
          </p>
        </div>

        <LoginForm redirectTo={redirectTo} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
