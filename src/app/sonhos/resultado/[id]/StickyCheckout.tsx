"use client";

import { useEffect, useRef, useState } from "react";

export function StickyCheckout({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [fixed, setFixed] = useState(false);
  const [wrapperHeight, setWrapperHeight] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    let isFixed = false;
    let docNaturalCenter = 0; // posição absoluta do centro do box no documento

    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;

      if (!isFixed) {
        const rect = el.getBoundingClientRect();
        const boxCenter = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;

        // Fixa quando o centro do box chega ao centro da viewport
        if (boxCenter <= viewportCenter) {
          docNaturalCenter = rect.top + rect.height / 2 + window.scrollY;
          isFixed = true;
          setWrapperHeight(rect.height);
          setFixed(true);
        }
      } else {
        // Libera se o usuário rolar para cima e o centro natural voltar acima do centro da viewport
        const naturalCenterRelative = docNaturalCenter - window.scrollY;
        if (naturalCenterRelative > window.innerHeight / 2) {
          isFixed = false;
          setFixed(false);
          setWrapperHeight(undefined);
        }
      }
    };

    const onResize = () => {
      isFixed = false;
      setFixed(false);
      setWrapperHeight(undefined);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: fixed ? wrapperHeight : undefined }}>
      <div
        style={
          fixed
            ? {
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: wrapperRef.current?.offsetWidth ?? "auto",
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
