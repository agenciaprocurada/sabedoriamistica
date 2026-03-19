"use client";

import { useState } from "react";

export function DreamCollapse({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 200;
  const displayed = isLong && !expanded ? text.slice(0, 200) + "…" : text;

  return (
    <div className="space-y-2">
      <p className="font-accent italic text-text-secondary leading-relaxed text-base">
        &ldquo;{displayed}&rdquo;
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="font-body text-xs text-gold hover:text-gold-light transition-colors duration-200"
        >
          {expanded ? "Ver menos ▲" : "Ver mais ▼"}
        </button>
      )}
    </div>
  );
}
