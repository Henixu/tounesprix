import Link from "next/link";

const items = [
  { href: "/dashboard", label: "Vue generale" },
  { href: "/dashboard/produits", label: "Produits" },
  { href: "/dashboard/boutiques", label: "Boutiques" },
  { href: "/dashboard/stats", label: "Statistiques" },
  { href: "/dashboard/utilisateurs", label: "Utilisateurs" },
];

export function AdminSidebar() {
  return (
    <aside className="w-full rounded-2xl border border-line bg-paper p-4 lg:w-72">
      <h2 className="mb-3 font-heading text-lg font-semibold text-ink-950">Admin</h2>
      <nav className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-muted hover:text-brass-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
