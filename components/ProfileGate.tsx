"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface ProfileGateProps {
  children?: React.ReactNode;
  action?: string;
}

export default function ProfileGate({ children, action = "this action" }: ProfileGateProps) {
  const { isAuthenticated, profileCompleted } = useAuth();

  if (isAuthenticated && profileCompleted) return <>{children}</>;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
      style={{
        backgroundColor: "#1a1a28",
        border: "1px solid #2e2e44",
      }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#6633ee22" }}
      >
        <Lock size={13} style={{ color: "#a78bfa" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-xs mb-0.5">
          Complete your profile to {action}
        </p>
        <p className="text-xs" style={{ color: "#8b8b9e" }}>
          Required: name, school, country, major, and at least one skill.
        </p>
      </div>
      <Link
        href="/profile/u1"
        className="text-xs font-semibold flex-shrink-0 px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
        style={{
          background: "linear-gradient(135deg, #6633ee, #7744ff)",
          color: "#fff",
        }}
      >
        Complete →
      </Link>
    </div>
  );
}
