import type { HTMLAttributes } from "react";

type BadgeVariant = "primary" | "accent" | "neutral";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-brand-100 text-brand-700",
  accent: "bg-amber-100 text-amber-700",
  neutral: "bg-slate-100 text-slate-700",
};

export function Badge({ className = "", variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
