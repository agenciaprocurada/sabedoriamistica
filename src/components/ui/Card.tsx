import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={[
        "bg-mystic-card border rounded-xl p-6",
        "border-gold-subtle",
        hover
          ? "transition-colors duration-200 hover:bg-mystic-cardHover hover:border-gold/40"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
