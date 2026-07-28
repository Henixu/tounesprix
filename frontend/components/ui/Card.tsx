import type { HTMLAttributes } from "react";

type BaseProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: BaseProps) {
  return <div className={`rounded-2xl border bg-white shadow-sm ${className}`} {...props} />;
}

export function CardHeader({ className = "", ...props }: BaseProps) {
  return <div className={`p-4 ${className}`} {...props} />;
}

export function CardTitle({ className = "", ...props }: BaseProps) {
  return <h3 className={`font-heading text-lg font-semibold text-slate-900 ${className}`} {...props} />;
}

export function CardDescription({ className = "", ...props }: BaseProps) {
  return <p className={`text-sm text-slate-600 ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }: BaseProps) {
  return <div className={className} {...props} />;
}
