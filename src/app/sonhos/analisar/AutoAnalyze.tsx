"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MysticLoader } from "@/components/ui";

const MESSAGES = [
  "Interpretando seu sonho...",
  "Decodificando os símbolos...",
  "Atravessando os véus do inconsciente...",
  "Revelando as mensagens ocultas...",
];

export function AutoAnalyze() {
  const router = useRouter();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const dream = sessionStorage.getItem("pendingDream");
    if (!dream) {
      router.replace("/sonhos");
      return;
    }
    sessionStorage.removeItem("pendingDream");

    (async () => {
      try {
        const res = await fetch("/api/sonhos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: dream }),
        });
        const data = await res.json();
        if (res.ok && data.dreamId) {
          router.replace(`/sonhos/resultado/${data.dreamId}`);
        } else {
          // Recoloca o sonho para não perder e vai para o form manual
          sessionStorage.setItem("pendingDream", dream);
          router.replace("/sonhos/analisar/form");
        }
      } catch {
        sessionStorage.setItem("pendingDream", dream);
        router.replace("/sonhos/analisar/form");
      }
    })();
  }, [router]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6">
      <MysticLoader size={72} text="" />
      <p className="font-display text-2xl text-gold text-center animate-pulse">
        Seu sonho está sendo analisado
      </p>
      <p className="font-body text-text-secondary text-center max-w-sm text-sm">
        Aguarde enquanto revelamos as mensagens ocultas do seu inconsciente…
      </p>
      <div className="flex gap-2 mt-2">
        {MESSAGES.map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-gold opacity-40" />
        ))}
      </div>
    </div>
  );
}
