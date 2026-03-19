"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";

export function UserSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (v: string) => {
      setValue(v);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (v) params.set("search", v);
        else params.delete("search");
        params.delete("page");
        router.push(`/sabedoriaadm/usuarios?${params.toString()}`);
      }, 300);
    },
    [router, searchParams]
  );

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Buscar por nome ou email..."
      className="w-full max-w-xs bg-mystic-input border border-gold-subtle rounded-xl px-4 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
    />
  );
}
