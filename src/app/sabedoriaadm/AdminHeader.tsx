"use client";

import { useRouter } from "next/navigation";

export function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/sabedoriaadm/login");
  }

  return (
    <header className="h-14 bg-mystic-card border-b border-gold-subtle flex items-center justify-between px-6 shrink-0 z-20">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gold flex items-center justify-center">
          <span className="font-display font-bold text-sm text-mystic-bg">SM</span>
        </div>
        <span className="font-display text-sm font-semibold text-gold">
          Administração
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="font-body text-xs text-text-muted hover:text-text-secondary border border-gold-subtle hover:border-gold/30 rounded-full px-4 py-1.5 transition-colors"
      >
        Sair
      </button>
    </header>
  );
}
