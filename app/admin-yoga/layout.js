"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }) {
  const path = usePathname();
  return (
    <AuthProvider>
      {path === "/admin-yoga/login" ? children : <AdminShell>{children}</AdminShell>}
    </AuthProvider>
  );
}
