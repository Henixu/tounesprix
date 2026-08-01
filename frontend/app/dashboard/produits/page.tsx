"use client";

import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { ProductManagement } from "@/components/dashboard/ProductManagement";
import { RequireAdmin } from "@/components/dashboard/RequireAdmin";

export default function DashboardProduitsPage() {
  return (
    <RequireAdmin>
      <div className="px-4 py-12 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
          <AdminSidebar />

          <div className="flex-1 space-y-6">
            <div>
              <h1 className="font-heading text-4xl font-medium text-ink-950">Produits</h1>
              <p className="mt-2 text-sm text-muted">
                Ajoutez, modifiez et supprimez des produits, et renseignez leurs prix par magasin.
              </p>
            </div>

            <ProductManagement />
          </div>
        </div>
      </div>
    </RequireAdmin>
  );
}
