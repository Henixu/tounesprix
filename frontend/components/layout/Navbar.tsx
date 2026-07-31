"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/comparaison", label: "Comparaison" },
  { href: "/dashboard", label: "Tableau de bord" },
];

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-heading text-xl font-semibold tracking-tight text-ink-950">
            TounesPrix
          </span>
          <span className="hidden font-mono-tab text-[11px] uppercase tracking-widest text-brass-600 sm:inline">
            comparateur
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-brass-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {!isLoading && user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-ink-700 sm:inline">{user.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-ink-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-900 transition-colors hover:bg-ink-950 hover:text-paper"
            >
              Deconnexion
            </button>
          </div>
        ) : (
          <Link
            href="/connexion"
            className="rounded-md border border-ink-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-900 transition-colors hover:bg-ink-950 hover:text-paper"
          >
            Connexion
          </Link>
        )}
      </div>
    </header>
  );
}
