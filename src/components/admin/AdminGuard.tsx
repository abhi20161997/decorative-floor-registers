"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linen">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-espresso border-t-transparent" />
          <p className="text-sm text-umber">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linen">
        <div className="max-w-md rounded-lg border border-linen bg-white p-8 text-center shadow-sm">
          <h1 className="font-display text-display-md text-espresso mb-2">
            Access Denied
          </h1>
          <p className="text-umber">
            You do not have admin privileges. Please contact the site
            administrator.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
