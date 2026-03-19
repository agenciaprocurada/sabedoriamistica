"use client";

import { InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  const id = useId();
  const inputId = props.id ?? id;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="font-body text-sm text-text-secondary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "font-body w-full rounded-lg px-4 py-3",
          "bg-mystic-input border border-gold-subtle",
          "text-text-primary placeholder:text-text-muted",
          "outline-none transition-all duration-200",
          "focus:border-gold focus:ring-2 focus:ring-gold-subtle",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    </div>
  );
}
