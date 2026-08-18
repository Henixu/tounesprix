import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  // text-ink-fixed (not text-ink-950): this text sits on the brass accent
  // color, which stays legible-with-dark-text in both themes by design, so
  // the text must stay fixed-dark too rather than swapping to light in dark mode.
  primary: "bg-brass-600 text-ink-fixed hover:bg-brass-500",
  secondary: "bg-ink-900 text-paper hover:bg-ink-950",
  outline: "border border-ink-900 bg-paper text-ink-900 hover:bg-ink-950 hover:text-paper",
};

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
