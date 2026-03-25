"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  dreamId: string;
  children: React.ReactNode;
}

export function StickyCheckout({ dreamId, children }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Mostra popup quando o box sai completamente pela parte de cima
      setShowPopup(rect.bottom < 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div ref={wrapperRef}>{children}</div>

      {/* Bottom popup CTA */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transform: showPopup ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          pointerEvents: showPopup ? "auto" : "none",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0f1226 0%, #0B0D1A 100%)",
            borderTop: "1px solid rgba(212,168,67,0.35)",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
          }}
          className="px-4 py-4 flex flex-col items-center gap-2"
        >
          <p className="font-body text-text-secondary text-xs text-center">
            🔓 Seu sonho guarda muito mais do que foi revelado
          </p>
          <button
            onClick={() => router.push(`/sonhos/checkout/${dreamId}`)}
            className="w-full max-w-sm font-body font-semibold text-base bg-gold hover:bg-gold-light text-mystic-bg px-6 py-3 rounded-full shadow-gold transition-all duration-200"
          >
            ✨ Desbloquear Interpretação Completa — R$ 9,90
          </button>
        </div>
      </div>
    </>
  );
}
