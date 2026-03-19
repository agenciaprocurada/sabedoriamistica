"use client";

import { TextareaHTMLAttributes, useId, useState } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  charCount?: boolean;
}

export function Textarea({
  label,
  charCount = false,
  className = "",
  maxLength,
  onChange,
  value,
  defaultValue,
  ...props
}: TextareaProps) {
  const id = useId();
  const inputId = props.id ?? id;

  const [count, setCount] = useState<number>(
    typeof defaultValue === "string" ? defaultValue.length : 0
  );

  const controlledLength =
    typeof value === "string" ? value.length : undefined;

  const displayCount = controlledLength ?? count;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={inputId}
            className="font-body text-sm text-text-secondary"
          >
            {label}
          </label>
        )}
        {charCount && (
          <span className="font-body text-xs text-text-muted">
            {displayCount}
            {maxLength ? `/${maxLength}` : ""} caracteres
          </span>
        )}
      </div>
      <textarea
        id={inputId}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          setCount(e.target.value.length);
          onChange?.(e);
        }}
        className={[
          "font-body w-full rounded-lg px-4 py-3",
          "bg-mystic-input border border-gold-subtle",
          "text-text-primary placeholder:text-text-muted",
          "outline-none transition-all duration-200",
          "focus:border-gold focus:ring-2 focus:ring-gold-subtle",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "min-h-[120px] resize-y",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    </div>
  );
}
