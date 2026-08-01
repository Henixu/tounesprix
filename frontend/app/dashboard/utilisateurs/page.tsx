"use client";

import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { RequireAdmin } from "@/components/dashboard/RequireAdmin";
import { UserManagement } from "@/components/dashboard/UserManagement";

export default function DashboardUtilisateursPage() {
  return (
    <RequireAdmin>
      <div className="px-4 py-12 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
          <AdminSidebar />

          <div className="flex-1 space-y-6">
            <div>
              <h1 className="font-heading text-4xl font-medium text-ink-950">Utilisateurs</h1>
              <p className="mt-2 text-sm text-muted">Gerez les roles et les comptes inscrits sur TounesPrix.</p>
            </div>

            <UserManagement />
          </div>
        </div>
      </div>
    </RequireAdmin>
  );
}
