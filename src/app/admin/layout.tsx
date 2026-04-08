"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-linen">
        <AdminSidebar />
        <main className="flex-1 ml-60 p-8">{children}</main>
      </div>
    </AdminGuard>
  );
}
