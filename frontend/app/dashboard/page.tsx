"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import { AdminManagement } from "@/components/dashboard/AdminManagement";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import {
  brandDistribution,
  categoryDistribution,
  formatPrice,
  dashboardStats,
  priceEvolution,
  storeBestPriceCounts,
} from "@/mock/dashboardData";

const brandColors = ["#7c5e21", "#a3792c", "#b98f3f", "#17293f", "#223752", "#5c6472"];

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
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const chartMargins = useMemo(() => ({ top: 8, right: 16, left: 0, bottom: 0 }), []);

  return (
    <div className="px-4 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        {isAdmin && <AdminSidebar />}

        <div className="flex-1 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-4xl font-medium text-ink-950">Tableau de bord</h1>
              {isAdmin && <Badge variant="primary">Vue administrateur</Badge>}
            </div>
            <p className="mt-2 text-sm text-muted">
              Suivi global du catalogue, des marques et des magasins connectes a TounesPrix.
            </p>
          </div>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatCard
              title="Produits"
              value={String(dashboardStats.productCount)}
              note="Produits mockes dans le catalogue."
            />
            <StatCard
              title="Magasins"
              value={String(dashboardStats.storeCount)}
              note="Boutiques qui publient des prix."
            />
            <StatCard
              title="Prix moyen"
              value={formatPrice(dashboardStats.averagePrice)}
              note="Moyenne des meilleurs prix par produit."
            />
            <StatCard
              title="Moins cher"
              value={formatPrice(dashboardStats.cheapest.offer.price)}
              note={dashboardStats.cheapest.product.name}
            />
            <StatCard
              title="Plus cher"
              value={formatPrice(dashboardStats.mostExpensive.offer.price)}
              note={dashboardStats.mostExpensive.product.name}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <Card className="rounded-xl border-line bg-paper">
              <CardContent className="p-5">
                <h2 className="font-heading text-2xl font-medium text-ink-950">Evolution des prix</h2>
                <p className="mt-1 text-sm text-muted">Tendance moyenne sur les derniers mois.</p>
                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceEvolution} margin={chartMargins}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dde2ea" />
                      <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: "#dde2ea" }} />
                      <YAxis tickLine={false} axisLine={{ stroke: "#dde2ea" }} width={42} />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#7c5e21"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#a3792c" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
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
                <p className="mt-1 text-sm text-muted">Marques presentes dans le catalogue mocke.</p>
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
                    <BarChart data={storeBestPriceCounts} margin={chartMargins}>
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

          {isAdmin && <AdminManagement />}
        </div>
      </div>
    </div>
  );
}
