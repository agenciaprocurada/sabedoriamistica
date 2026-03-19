"use client";

import { useState } from "react";
import type { HeaderUser } from "./Header";

interface MobileMenuProps {
  user: HeaderUser | null;
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hambúrguer */}
      <button
        aria-label="Abrir menu"
        onClick={() => setOpen((v) => !v)}
        className="text-text-secondary hover:text-gold transition-colors p-1"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </>
          )}
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-mystic-card border-t border-gold-subtle px-6 py-4 flex flex-col gap-3 shadow-gold-lg">
          {user ? (
            <>
              <span className="font-body text-text-secondary text-sm">
                Olá, {user.name || user.email}
              </span>
              <a
                href="/sonhos/meus"
                className="w-full text-center font-body text-sm border border-gold-subtle text-gold px-4 py-2 rounded-full hover:bg-gold-subtle transition-colors duration-200"
              >
                Meus Sonhos
              </a>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="w-full font-body text-sm border border-gold-subtle text-gold px-4 py-2 rounded-full hover:bg-gold-subtle transition-colors duration-200"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <a
              href="/login"
              className="w-full text-center font-body text-sm bg-gold hover:bg-gold-light text-mystic-bg font-semibold px-5 py-2 rounded-full shadow-gold transition-colors duration-200"
            >
              Entrar
            </a>
          )}
        </div>
      )}
    </div>
  );
}
