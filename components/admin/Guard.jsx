"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Guard({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/admin-yoga/login");
  }, [loading, user, router]);

  if (loading) {
    return <p className="p-10 text-sm text-forest-mid">Checking session…</p>;
  }
  if (!user) return null;
  return children;
}
