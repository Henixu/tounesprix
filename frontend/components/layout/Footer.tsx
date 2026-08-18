import Link from "next/link";

export function Footer() {
  return (
    // Uses the fixed (non-theme-swapping) ink/paper tokens so the footer stays
    // a deliberate dark band regardless of light/dark mode, matching the hero.
    <footer className="border-t border-line bg-ink-fixed text-paper-fixed/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <span className="font-heading text-lg font-semibold text-paper-fixed">TounesPrix</span>
          <p className="text-sm text-paper-fixed/70">
            Comparez, choisissez, economisez — le materiel informatique en Tunisie, sans mauvaise surprise.
          </p>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-paper-fixed/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 TounesPrix. Tous droits reserves.</p>
          <div className="flex gap-5">
            <Link href="/catalogue" className="transition-colors hover:text-brass-fixed">Catalogue</Link>
            <Link href="/comparaison" className="transition-colors hover:text-brass-fixed">Comparaison</Link>
            <Link href="/connexion" className="transition-colors hover:text-brass-fixed">Connexion</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}