"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Check, X, Inbox } from "lucide-react";
import { getPendingUsers, setUserStatus } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import VerifiedAvatar from "@/components/VerifiedAvatar";

export default function AdminPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && currentUser?.role === "admin";

  const [pending, setPending] = useState(() => getPendingUsers());

  // Redirect anyone who isn't an admin away from this page.
  useEffect(() => {
    if (isAuthenticated && !isAdmin) router.replace("/engineering");
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, isAdmin, router]);

  function handleApprove(userId: string) {
    setUserStatus(userId, "approved");
    setPending(getPendingUsers());
  }

  function handleReject(userId: string) {
    setUserStatus(userId, "rejected");
    setPending(getPendingUsers());
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={20} style={{ color: "#a78bfa" }} />
        <h1 className="text-2xl font-bold text-white">Admin</h1>
      </div>
      <p className="text-sm mb-8" style={{ color: "#8b8b9e" }}>
        Review and moderate new signups before they're fully approved.
      </p>

      <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
        <h2 className="text-sm font-semibold text-white mb-4">
          Pending signups {pending.length > 0 && `(${pending.length})`}
        </h2>

        {pending.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Inbox size={24} style={{ color: "#5a5a6e" }} />
            <p className="text-sm" style={{ color: "#8b8b9e" }}>No pending signups right now.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <VerifiedAvatar name={user.name || "?"} avatarUrl={user.avatarUrl} verified={user.verified} size="sm" />
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${user.id}`} className="text-sm font-medium text-white hover:underline">
                    {user.name || "(no name yet)"}
                  </Link>
                  <p className="text-xs truncate" style={{ color: "#8b8b9e" }}>{user.email}</p>
                </div>
                <button
                  onClick={() => handleApprove(user.id)}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#0f2e22", color: "#34d399", border: "1px solid #1d4d38" }}
                >
                  <Check size={13} /> Approve
                </button>
                <button
                  onClick={() => handleReject(user.id)}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#3f1d1d", color: "#f87171", border: "1px solid #5c2424" }}
                >
                  <X size={13} /> Reject
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
