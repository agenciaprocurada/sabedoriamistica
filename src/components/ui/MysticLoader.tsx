"use client";

interface MysticLoaderProps {
  text?: string;
  size?: number;
}

export function MysticLoader({
  text = "Consultando as estrelas...",
  size = 48,
}: MysticLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: "mystic-spin 3s linear infinite" }}
        aria-hidden="true"
      >
        {/* Lua crescente */}
        <path
          d="M24 4C13 4 4 13 4 24C4 35 13 44 24 44C20 38 18 31 18 24C18 17 20 10 24 4Z"
          fill="#D4A843"
          style={{ animation: "mystic-pulse 3s ease-in-out infinite" }}
        />
        {/* Contorno externo suave */}
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="#D4A843"
          strokeWidth="1"
          strokeOpacity="0.3"
          strokeDasharray="4 4"
        />
      </svg>

      {text && (
        <p
          className="font-accent italic text-text-secondary text-base"
          style={{ animation: "mystic-pulse 3s ease-in-out infinite" }}
        >
          {text}
        </p>
      )}

      <style>{`
        @keyframes mystic-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes mystic-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
