"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, Users } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AdminPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && currentUser?.role === "admin";

  useEffect(() => {
    if (isAuthenticated && !isAdmin) router.replace("/engineering");
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={20} style={{ color: "#a78bfa" }} />
        <h1 className="text-2xl font-bold text-white">Admin</h1>
      </div>
      <p className="text-sm mb-8" style={{ color: "#8b8b9e" }}>
        BuildNet network management. User analytics will appear here once connected to the database.
      </p>

      <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
        <Users size={32} className="mx-auto mb-3" style={{ color: "#2e2e44" }} />
        <p className="text-sm font-medium text-white mb-1">Phase B — coming soon</p>
        <p className="text-xs" style={{ color: "#8b8b9e" }}>
          Full admin dashboard (user list, verification status, content moderation) will be available once the Supabase database is wired up.
        </p>
      </div>
    </div>
  );
}
