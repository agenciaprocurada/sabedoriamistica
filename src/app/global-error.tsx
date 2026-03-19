"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ background: "#0B0D1A", color: "#F0EBE0", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", gap: "1rem" }}>
        <p style={{ fontSize: "1.5rem", color: "#D4A843" }}>Algo deu errado</p>
        <button
          onClick={reset}
          style={{ background: "#D4A843", color: "#0B0D1A", border: "none", borderRadius: "9999px", padding: "0.5rem 1.5rem", cursor: "pointer", fontWeight: 600 }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
