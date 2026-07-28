import Link from "next/link";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/comparaison", label: "Comparaison" },
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/connexion", label: "Connexion" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="font-heading text-xl font-semibold text-slate-900">
          TounesPrix
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/connexion"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
        >
          Connexion
        </Link>
      </div>
    </header>
  );
}
