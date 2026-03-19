"use client";

import { useRouter } from "next/navigation";

export function CheckoutButton({ dreamId }: { dreamId: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/sonhos/checkout/${dreamId}`)}
      className="block w-full text-center font-body font-semibold text-lg bg-gold hover:bg-gold-light text-mystic-bg px-8 py-4 rounded-full shadow-gold hover:shadow-gold-lg transition-all duration-200"
    >
      ✨ DESBLOQUEAR INTERPRETAÇÃO COMPLETA
    </button>
  );
}
