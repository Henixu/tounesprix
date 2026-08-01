"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { getApiErrorMessage } from "@/services/api";
import { getStatsOverview, type StatsOverview } from "@/services/stats";

function formatPrice(price: number) {
  return `${price.toLocaleString("fr-FR")} TND`;
}

function StatCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <Card className="rounded-xl border-line bg-paper">
      <CardContent className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
        <p className="mt-2 font-mono-tab text-2xl text-ink-950">{value}</p>
        <p className="mt-2 text-sm text-muted">{note}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [overview, setOverview] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getStatsOverview()
      .then((data) => {
        if (!cancelled) setOverview(data);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, "Impossible de charger les statistiques."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="px-4 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        <AdminSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-4xl font-medium text-ink-950">Tableau de bord</h1>
              <Badge variant="primary">Vue administrateur</Badge>
            </div>
            <p className="mt-2 text-sm text-muted">
              Suivi global du catalogue, des marques et des magasins connectes a TounesPrix.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[30vh] items-center justify-center">
              <Loader label="Chargement des statistiques..." />
            </div>
          ) : error || !overview ? (
            <Card className="rounded-xl border-line bg-paper">
              <CardContent className="p-8 text-center">
                <h3 className="font-heading text-2xl font-medium text-ink-950">Erreur</h3>
                <p className="mt-2 text-sm text-muted">{error || "Aucune donnee disponible."}</p>
              </CardContent>
            </Card>
          ) : (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <StatCard
                title="Produits"
                value={String(overview.productCount)}
                note="Produits references dans le catalogue."
              />
              <StatCard
                title="Magasins"
                value={String(overview.storeCount)}
                note="Boutiques qui publient des prix."
              />
              <StatCard
                title="Prix moyen"
                value={formatPrice(overview.averagePrice)}
                note="Moyenne des meilleurs prix par produit."
              />
              <StatCard
                title="Moins cher"
                value={overview.cheapest ? formatPrice(overview.cheapest.price) : "-"}
                note={overview.cheapest?.product.name ?? "Aucun prix disponible"}
              />
              <StatCard
                title="Plus cher"
                value={overview.mostExpensive ? formatPrice(overview.mostExpensive.price) : "-"}
                note={overview.mostExpensive?.product.name ?? "Aucun prix disponible"}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
