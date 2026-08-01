"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const baseLinks = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/comparaison", label: "Comparaison" },
];

const dashboardLink = { href: "/dashboard", label: "Tableau de bord" };

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = user?.role === "admin";
  const links = isAdmin ? [...baseLinks, dashboardLink] : baseLinks;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
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

        <div className="hidden md:flex">
          {!isLoading && user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-ink-700">{user.name}</span>
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

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink-900 md:hidden"
        >
          <span className="sr-only">Menu</span>
          {isMobileMenuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <nav className="border-t border-line bg-paper px-4 py-4 sm:px-8 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-muted hover:text-brass-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t border-line pt-3">
            {!isLoading && user ? (
              <div className="flex items-center justify-between gap-3 px-3">
                <span className="text-sm font-medium text-ink-700">{user.name}</span>
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
                className="mx-3 flex items-center justify-center rounded-md border border-ink-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-900 transition-colors hover:bg-ink-950 hover:text-paper"
              >
                Connexion
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
