"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Users, ShieldAlert, LogIn, CheckCircle2, Clock, Check, X,
} from "lucide-react";
import {
  getCohortById,
  getUserById,
  getDisciplineById,
  hasRequestedToJoin,
  requestToJoinCohort,
  getPendingRequests,
  approveJoinRequest,
  rejectJoinRequest,
} from "@/lib/mock-data";
import VerifiedAvatar from "@/components/VerifiedAvatar";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export default function CohortDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();
  const [, setTick] = useState(0);

  const cohort = getCohortById(params.id as string);

  if (!cohort) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-white font-medium mb-2">Cohort not found</p>
        <button onClick={() => router.push("/foundry")} className="text-sm" style={{ color: "#6633ee" }}>
          Back to Foundry
        </button>
      </div>
    );
  }

  const disc = getDisciplineById(cohort.disciplineId);
  const members = cohort.memberIds.map(getUserById).filter(Boolean);
  const spotsLeft = cohort.teamSize - cohort.memberIds.length;
  const canJoin = isAuthenticated && (currentUser?.verified ?? false);
  const isMember = !!currentUser && cohort.memberIds.includes(currentUser.id);
  const requested = !!currentUser && hasRequestedToJoin(cohort.id, currentUser.id);
  const isOwner = !!currentUser && currentUser.id === cohort.ownerId;
  const owner = getUserById(cohort.ownerId);
  const pendingRequests = isOwner ? getPendingRequests(cohort.id) : [];

  function handleRequestToJoin() {
    if (!currentUser || !canJoin) return;
    requestToJoinCohort(cohort!.id, currentUser.id);
    setTick((t) => t + 1);
  }

  function handleApprove(requestId: string) {
    approveJoinRequest(requestId);
    setTick((t) => t + 1);
  }

  function handleReject(requestId: string) {
    rejectJoinRequest(requestId);
    setTick((t) => t + 1);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => router.push("/foundry")}
        className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: "#8b8b9e" }}
      >
        <ArrowLeft size={15} /> Back to Foundry
      </button>

      {/* Header card */}
      <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
        {disc && (
          <span
            className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full mb-4"
            style={{ backgroundColor: disc.color + "22", color: disc.color }}
          >
            {disc.name}
          </span>
        )}

        <h1 className="text-xl font-bold text-white mb-2 leading-snug">{cohort.title}</h1>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#a78bfa" }}>{cohort.goal}</p>
        <p className="text-sm leading-relaxed" style={{ color: "#c4c4d4" }}>{cohort.description}</p>

        {owner && (
          <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: "1px solid #1e1e2e" }}>
            <VerifiedAvatar name={owner.name} avatarUrl={owner.avatarUrl} verified={owner.verified} size="sm" />
            <span className="text-xs" style={{ color: "#8b8b9e" }}>
              Started by{" "}
              <Link href={`/profile/${owner.id}`} className="text-white hover:underline">
                {owner.name}
              </Link>
            </span>
          </div>
        )}
      </div>

      {/* Gate banner */}
      {!isAuthenticated && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm"
          style={{ backgroundColor: "#1a1a28", border: "1px solid #2e2e44" }}
        >
          <LogIn size={14} style={{ color: "#a78bfa" }} />
          <span style={{ color: "#8b8b9e" }}>Sign in to request to join this cohort.</span>
          <Link href="/login" className="ml-auto text-xs font-semibold flex-shrink-0" style={{ color: "#a78bfa" }}>
            Sign in →
          </Link>
        </div>
      )}
      {isAuthenticated && !currentUser?.verified && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm"
          style={{ backgroundColor: "#1a1208", border: "1px solid #5c3b12" }}
        >
          <ShieldAlert size={14} style={{ color: "#fb923c" }} />
          <span style={{ color: "#8b8b9e" }}>Verify your account to join this cohort. Connect GitHub or LinkedIn from your profile.</span>
          <Link href={`/profile/${currentUser?.id}`} className="ml-auto text-xs font-semibold flex-shrink-0" style={{ color: "#fb923c" }}>
            Verify →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Pending requests — owner only */}
          {isOwner && (
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
              <h2 className="text-sm font-semibold text-white mb-4">
                Pending requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
              </h2>
              {pendingRequests.length === 0 ? (
                <p className="text-xs" style={{ color: "#8b8b9e" }}>No pending requests right now.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {pendingRequests.map((req) => {
                    const requester = getUserById(req.userId);
                    if (!requester) return null;
                    return (
                      <div key={req.id} className="flex items-center gap-3">
                        <VerifiedAvatar name={requester.name} avatarUrl={requester.avatarUrl} verified={requester.verified} size="sm" />
                        <div className="flex-1 min-w-0">
                          <Link href={`/profile/${requester.id}`} className="text-sm font-medium text-white hover:underline">
                            {requester.name}
                          </Link>
                          <p className="text-xs truncate" style={{ color: "#8b8b9e" }}>{requester.major}</p>
                        </div>
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90"
                          style={{ backgroundColor: "#0f2e22", color: "#34d399", border: "1px solid #1d4d38" }}
                        >
                          <Check size={13} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90"
                          style={{ backgroundColor: "#3f1d1d", color: "#f87171", border: "1px solid #5c2424" }}
                        >
                          <X size={13} /> Reject
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Open roles */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
            <h2 className="text-sm font-semibold text-white mb-3">Open roles</h2>
            <div className="flex flex-wrap gap-2">
              {cohort.rolesOpen.length > 0 ? (
                cohort.rolesOpen.map((role) => (
                  <span
                    key={role}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{ backgroundColor: "#6633ee15", color: "#a78bfa", border: "1px solid #6633ee33" }}
                  >
                    {role}
                  </span>
                ))
              ) : (
                <p className="text-xs" style={{ color: "#8b8b9e" }}>No open roles right now.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Members */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Users size={15} style={{ color: "#6633ee" }} /> Members ({cohort.memberIds.length}/{cohort.teamSize})
            </h2>
            <div className="flex flex-col gap-3">
              {members.map((member) =>
                member ? (
                  <Link key={member.id} href={`/profile/${member.id}`} className="flex items-center gap-2">
                    <VerifiedAvatar name={member.name} avatarUrl={member.avatarUrl} verified={member.verified} size="sm" />
                    <div>
                      <p className="text-xs font-medium text-white hover:underline">{member.name}</p>
                      <p className="text-xs" style={{ color: "#8b8b9e" }}>{member.major.split(" ")[0]}</p>
                    </div>
                  </Link>
                ) : null
              )}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleRequestToJoin}
            className={cn(
              "w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity flex items-center justify-center gap-1.5",
              isMember || requested || !canJoin ? "text-white opacity-50 cursor-not-allowed" : "text-white hover:opacity-90"
            )}
            style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
            disabled={!canJoin || isMember || requested}
          >
            {isMember ? (
              <><CheckCircle2 size={15} /> You&apos;re a member</>
            ) : requested ? (
              <><Clock size={15} /> Requested</>
            ) : (
              "Request to join"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
