"use client";

import Link from "next/link";
import { MessageCircle, ShieldAlert, LogIn } from "lucide-react";
import { getDMConversations, getUserById } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import VerifiedAvatar from "@/components/VerifiedAvatar";

export default function DMListPage() {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="flex-1 flex flex-col">
        {/* DM header */}
        <div className="px-5 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #1e1e2e" }}>
          <h2 className="text-sm font-bold text-white">Direct Messages</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <LogIn size={28} style={{ color: "#2e2e44" }} />
            <p className="text-sm text-white font-medium">Sign in to message builders</p>
            <Link
              href="/login"
              className="text-xs font-semibold px-4 py-2 rounded-xl text-white"
              style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
            >
              Sign in →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser.verified) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="px-5 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #1e1e2e" }}>
          <h2 className="text-sm font-bold text-white">Direct Messages</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <ShieldAlert size={28} style={{ color: "#fb923c" }} />
            <p className="text-sm text-white font-medium">Verification required</p>
            <p className="text-xs" style={{ color: "#8b8b9e" }}>Connect GitHub or LinkedIn from your profile to message other builders.</p>
            <Link
              href={`/profile/${currentUser.id}`}
              className="text-xs font-semibold px-4 py-2 rounded-xl"
              style={{ backgroundColor: "#1a1208", color: "#fb923c", border: "1px solid #5c3b12" }}
            >
              Go to profile →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const convos = getDMConversations(currentUser.id);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="px-5 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #1e1e2e" }}>
        <h2 className="text-sm font-bold text-white">Direct Messages</h2>
      </div>

      {convos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center px-6">
            <MessageCircle size={28} style={{ color: "#2e2e44" }} />
            <p className="text-sm text-white font-medium">No conversations yet</p>
            <p className="text-xs" style={{ color: "#8b8b9e" }}>Visit someone's profile to start a DM.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {convos.map((userId) => {
            const u = getUserById(userId);
            if (!u) return null;
            return (
              <Link
                key={userId}
                href={`/community/dm/${userId}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-[#1a1a28]"
              >
                <VerifiedAvatar name={u.name} avatarUrl={u.avatarUrl} verified={u.verified} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{u.name}</p>
                  <p className="text-xs truncate" style={{ color: "#8b8b9e" }}>{u.major.split(" ")[0]}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
