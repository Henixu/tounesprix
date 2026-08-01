"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/ui/Loader";
import { useAuth } from "@/contexts/AuthContext";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAdmin, router]);

  if (isLoading || !isAdmin) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-16">
        <Loader label="Verification des droits..." />
      </div>
    );
  }

  return <>{children}</>;
}
