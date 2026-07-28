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
    <aside className="w-full rounded-2xl border border-slate-200 bg-white p-4 lg:w-72">
      <h2 className="mb-3 font-heading text-lg font-semibold text-slate-900">Admin</h2>
      <nav className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
