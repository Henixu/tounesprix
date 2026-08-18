type LoaderProps = {
  label?: string;
};

export function Loader({ label = "Chargement..." }: LoaderProps) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-muted" role="status" aria-live="polite">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-brass-600" />
      <span>{label}</span>
    </div>
  );
}
