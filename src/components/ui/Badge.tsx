import { HTMLAttributes } from "react";

type Variant = "solid" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  solid: "bg-gold text-mystic-bg",
  outline: "bg-gold-subtle text-gold border border-gold/30",
};

export function Badge({
  variant = "outline",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "font-body inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
