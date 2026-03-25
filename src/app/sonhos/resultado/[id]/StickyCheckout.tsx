"use client";

import { useEffect, useRef, useState } from "react";

const NAVBAR_HEIGHT = 72; // altura aprox. da navbar

export function StickyCheckout({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [fixed, setFixed] = useState(false);
  const [snapshot, setSnapshot] = useState({
    naturalTop: 0, // scrollY no momento em que fixamos
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    let isFixed = false;
    let snap = { naturalTop: 0, left: 0, width: 0, height: 0 };

    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;

      if (!isFixed) {
        const rect = el.getBoundingClientRect();
        // Quando o topo do elemento chega na navbar → fixa
        if (rect.top <= NAVBAR_HEIGHT) {
          snap = {
            naturalTop: rect.top + window.scrollY, // posição absoluta no doc
            left: rect.left,
            width: rect.width,
            height: rect.height,
          };
          isFixed = true;
          setFixed(true);
          setSnapshot(snap);
        }
      } else {
        // Se o usuário rolar para cima além da posição original → libera
        const naturalTopRelative = snap.naturalTop - window.scrollY;
        if (naturalTopRelative > NAVBAR_HEIGHT) {
          isFixed = false;
          setFixed(false);
        }
      }
    };

    const onResize = () => {
      // Ao redimensionar, reseta o estado para re-calcular
      isFixed = false;
      setFixed(false);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    /* O wrapper mantém o espaço no fluxo quando o filho está fixo */
    <div
      ref={wrapperRef}
      style={{ height: fixed ? snapshot.height : undefined }}
    >
      <div
        style={
          fixed
            ? {
                position: "fixed",
                top: NAVBAR_HEIGHT,
                left: snapshot.left,
                width: snapshot.width,
                zIndex: 50,
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
