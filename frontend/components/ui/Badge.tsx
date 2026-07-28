import type { HTMLAttributes } from "react";

type BadgeVariant = "primary" | "accent" | "neutral";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-brass-100 text-brass-700",
  accent: "bg-ink-900 text-brass-300",
  neutral: "bg-paper-muted text-ink-700",
};

export function Badge({ className = "", variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
