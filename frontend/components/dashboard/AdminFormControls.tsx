export type FormMessage = { type: "success" | "error"; text: string } | null;

export const inputClassName =
  "w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink-900 placeholder:text-muted transition-colors focus:border-brass-500 focus:outline-none focus:ring-2 focus:ring-brass-500/25";

export function MessageBanner({ message }: { message: FormMessage }) {
  if (!message) return null;
  return (
    <p
      className={`rounded-md px-3 py-2 text-sm ${
        message.type === "success"
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
      }`}
    >
      {message.text}
    </p>
  );
}
