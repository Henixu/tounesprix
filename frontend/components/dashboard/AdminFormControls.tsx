export type FormMessage = { type: "success" | "error"; text: string } | null;

export const inputClassName =
  "w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink-900 placeholder:text-muted focus:border-brass-500 focus:outline-none";

export function MessageBanner({ message }: { message: FormMessage }) {
  if (!message) return null;
  return (
    <p
      className={`rounded-md px-3 py-2 text-sm ${
        message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
      }`}
    >
      {message.text}
    </p>
  );
}
