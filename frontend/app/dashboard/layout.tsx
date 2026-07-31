"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/ui/Loader";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/connexion");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-16">
        <Loader label="Verification de la session..." />
      </div>
    );
  }

  return <>{children}</>;
}
