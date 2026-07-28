import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-xl border border-line bg-paper px-4 py-2 text-sm text-ink-900 placeholder:text-muted focus:border-brass-500 focus:outline-none ${className}`}
      {...props}
    />
  );
}
