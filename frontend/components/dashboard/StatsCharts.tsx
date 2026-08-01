"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { getApiErrorMessage } from "@/services/api";
import type { Price } from "@/services/prices";
import { getProducts, type Product } from "@/services/products";
import {
  getBestPriceStores,
  getPriceEvolution,
  getStatsByBrand,
  getStatsByCategory,
  type BestPriceStoreStat,
  type BrandStat,
  type CategoryStat,
} from "@/services/stats";

const brandColors = ["#7c5e21", "#a3792c", "#b98f3f", "#17293f", "#223752", "#5c6472"];

function buildEvolutionChartData(prices: Price[]) {
  const byDate = new Map<string, Record<string, number>>();
  const storeNames = new Set<string>();

  prices.forEach((price) => {
    const dateKey = new Date(price.date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
    const storeName = price.storeId?.name ?? "Magasin";
    storeNames.add(storeName);

    if (!byDate.has(dateKey)) byDate.set(dateKey, {});
    byDate.get(dateKey)![storeName] = price.price;
  });

  return {
    data: Array.from(byDate.entries()).map(([date, values]) => ({ date, ...values })),
    storeNames: Array.from(storeNames),
  };
}

export function StatsCharts() {
  const chartMargins = useMemo(() => ({ top: 8, right: 16, left: 0, bottom: 0 }), []);

  const [categoryDistribution, setCategoryDistribution] = useState<CategoryStat[]>([]);
  const [brandDistribution, setBrandDistribution] = useState<BrandStat[]>([]);
  const [storeBestPriceCounts, setStoreBestPriceCounts] = useState<BestPriceStoreStat[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProductId, setSelectedProductId] = useState("");
  const [priceHistory, setPriceHistory] = useState<Price[]>([]);
  const [evolutionLoading, setEvolutionLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([getStatsByCategory(), getStatsByBrand(), getBestPriceStores(), getProducts()])
      .then(([categoryData, brandData, storeData, productsData]) => {
        if (cancelled) return;
        setCategoryDistribution(categoryData);
        setBrandDistribution(brandData);
        setStoreBestPriceCounts(storeData);
        setProducts(productsData);
        setSelectedProductId((current) => current || productsData[0]?._id || "");
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

  useEffect(() => {
    if (!selectedProductId) return;
    let cancelled = false;
    setEvolutionLoading(true);

    getPriceEvolution(selectedProductId)
      .then((data) => {
        if (!cancelled) setPriceHistory(data);
      })
      .catch(() => {
        if (!cancelled) setPriceHistory([]);
      })
      .finally(() => {
        if (!cancelled) setEvolutionLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedProductId]);

  const { data: evolutionData, storeNames } = useMemo(
    () => buildEvolutionChartData(priceHistory),
    [priceHistory],
  );

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader label="Chargement des statistiques..." />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="rounded-xl border-line bg-paper">
        <CardContent className="p-8 text-center">
          <h3 className="font-heading text-2xl font-medium text-ink-950">Erreur</h3>
          <p className="mt-2 text-sm text-muted">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-xl border-line bg-paper">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-2xl font-medium text-ink-950">Evolution des prix</h2>
                <p className="mt-1 text-sm text-muted">Historique des prix releves par magasin.</p>
              </div>
              {products.length > 0 && (
                <select
                  value={selectedProductId}
                  onChange={(event) => setSelectedProductId(event.target.value)}
                  className="rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink-900 focus:border-brass-500 focus:outline-none"
                >
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="mt-4 h-72">
              {evolutionLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader label="Chargement de l'historique..." />
                </div>
              ) : evolutionData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted">
                  Aucun historique de prix pour ce produit.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionData} margin={chartMargins}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dde2ea" />
                    <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: "#dde2ea" }} />
                    <YAxis tickLine={false} axisLine={{ stroke: "#dde2ea" }} width={42} />
                    {storeNames.map((storeName, index) => (
                      <Line
                        key={storeName}
                        type="monotone"
                        dataKey={storeName}
                        stroke={brandColors[index % brandColors.length]}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-line bg-paper">
          <CardContent className="p-5">
            <h2 className="font-heading text-2xl font-medium text-ink-950">Produits par categorie</h2>
            <p className="mt-1 text-sm text-muted">Repartition du catalogue courant.</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDistribution} margin={chartMargins}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dde2ea" />
                  <XAxis dataKey="category" tickLine={false} axisLine={{ stroke: "#dde2ea" }} interval={0} angle={-15} textAnchor="end" height={70} />
                  <YAxis tickLine={false} axisLine={{ stroke: "#dde2ea" }} allowDecimals={false} />
                  <Bar dataKey="count" fill="#a3792c" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-xl border-line bg-paper">
          <CardContent className="p-5">
            <h2 className="font-heading text-2xl font-medium text-ink-950">Repartition des marques</h2>
            <p className="mt-1 text-sm text-muted">Marques presentes dans le catalogue.</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={brandDistribution}
                    dataKey="count"
                    nameKey="brand"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                  >
                    {brandDistribution.map((entry, index) => (
                      <Cell key={entry.brand} fill={brandColors[index % brandColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {brandDistribution.map((entry, index) => (
                <Badge key={entry.brand} variant="neutral" className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: brandColors[index % brandColors.length] }} />
                  {entry.brand} ({entry.count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-line bg-paper">
          <CardContent className="p-5">
            <h2 className="font-heading text-2xl font-medium text-ink-950">Magasins les plus competitifs</h2>
            <p className="mt-1 text-sm text-muted">Nombre de fois ou chaque magasin propose le meilleur prix.</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={storeBestPriceCounts.map((item) => ({
                    store: item.store?.name ?? "Inconnu",
                    count: item.count,
                  }))}
                  margin={chartMargins}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#dde2ea" />
                  <XAxis dataKey="store" tickLine={false} axisLine={{ stroke: "#dde2ea" }} />
                  <YAxis tickLine={false} axisLine={{ stroke: "#dde2ea" }} allowDecimals={false} />
                  <Bar dataKey="count" fill="#17293f" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
