"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, Users } from "lucide-react";
import { users } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import VerifiedAvatar from "@/components/VerifiedAvatar";

export default function AdminPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && currentUser?.role === "admin";

  useEffect(() => {
    if (isAuthenticated && !isAdmin) router.replace("/engineering");
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, isAdmin, router]);

  if (!isAdmin) return null;

  const builders = users.filter((u) => u.id !== currentUser?.id);
  const verified = builders.filter((u) => u.verified).length;
  const unverified = builders.filter((u) => !u.verified).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={20} style={{ color: "#a78bfa" }} />
        <h1 className="text-2xl font-bold text-white">Admin</h1>
      </div>
      <p className="text-sm mb-8" style={{ color: "#8b8b9e" }}>
        BuildNet network management.
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Total builders", value: builders.length, color: "#a78bfa" },
          { label: "Verified", value: verified, color: "#34d399" },
          { label: "Unverified", value: unverified, color: "#fb923c" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border p-4 text-center" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "#8b8b9e" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Builder list */}
      <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Users size={15} style={{ color: "#6633ee" }} /> All builders
        </h2>
        <div className="flex flex-col gap-3">
          {builders.map((u) => (
            <div key={u.id} className="flex items-center gap-3">
              <VerifiedAvatar name={u.name || "?"} avatarUrl={u.avatarUrl} verified={u.verified} size="sm" />
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${u.id}`} className="text-sm font-medium text-white hover:underline">
                  {u.name || "(no name)"}
                </Link>
                <p className="text-xs truncate" style={{ color: "#8b8b9e" }}>{u.email}</p>
              </div>
              {u.verified ? (
                <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "#0f2e22", color: "#34d399", border: "1px solid #1d4d38" }}>
                  <ShieldCheck size={11} /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "#2a1f0a", color: "#fb923c", border: "1px solid #5c3b12" }}>
                  <ShieldAlert size={11} /> Unverified
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
