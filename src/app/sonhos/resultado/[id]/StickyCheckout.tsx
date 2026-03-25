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
    let docNaturalTop = 0;

    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;

      if (!isFixed) {
        const rect = el.getBoundingClientRect();
        // Fixa assim que qualquer parte do box entra na viewport (pelo rodapé)
        if (rect.top < window.innerHeight) {
          docNaturalTop = rect.top + window.scrollY;
          isFixed = true;
          setWrapperHeight(rect.height);
          setFixed(true);
        }
      } else {
        // Libera se o usuário rolar para cima e o box saísse da viewport
        const naturalTopRelative = docNaturalTop - window.scrollY;
        if (naturalTopRelative >= window.innerHeight) {
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
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
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
