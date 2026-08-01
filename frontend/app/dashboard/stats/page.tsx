"use client";

import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { StatsCharts } from "@/components/dashboard/StatsCharts";

export default function DashboardStatsPage() {
  return (
    <div className="px-4 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        <AdminSidebar />

        <div className="flex-1 space-y-6">
          <div>
            <h1 className="font-heading text-4xl font-medium text-ink-950">Statistiques</h1>
            <p className="mt-2 text-sm text-muted">
              Analyse detaillee du catalogue, des marques et de la competitivite des magasins.
            </p>
          </div>

          <StatsCharts />
        </div>
      </div>
    </div>
  );
}
