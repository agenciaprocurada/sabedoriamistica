"use client";

interface Block {
  type: "heading" | "paragraph";
  text: string;
}

function parse(markdown: string): Block[] {
  return markdown
    .split("\n")
    .reduce<Block[]>((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed) return acc;
      if (trimmed.startsWith("## ") || trimmed.startsWith("### ")) {
        const text = trimmed.startsWith("## ") ? trimmed.slice(3) : trimmed.slice(4);
        acc.push({ type: "heading", text });
      } else {
        const last = acc[acc.length - 1];
        if (last?.type === "paragraph") {
          last.text += " " + trimmed;
        } else {
          acc.push({ type: "paragraph", text: trimmed });
        }
      }
      return acc;
    }, []);
}

export function AnalysisMarkdown({ content }: { content: string }) {
  const blocks = parse(content);

  return (
    <div className="space-y-4">
      {blocks.map((block, i) =>
        block.type === "heading" ? (
          <h3
            key={i}
            className="font-display text-xl font-semibold text-gold mt-6 first:mt-0"
          >
            {block.text}
          </h3>
        ) : (
          <p key={i} className="font-body text-text-primary leading-relaxed">
            {block.text}
          </p>
        )
      )}
    </div>
  );
}
