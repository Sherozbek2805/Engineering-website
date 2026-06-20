"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Users, ShieldAlert, LogIn, CheckCircle2, Clock, Check, X,
} from "lucide-react";
import { getDisciplineById } from "@/lib/mock-data";
import {
  getCohortById, requestToJoin, updateMemberStatus, getUserCohortStatus,
  type DbCohort, type DbMember,
} from "@/lib/db";
import VerifiedAvatar from "@/components/VerifiedAvatar";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export default function CohortDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();

  const [cohort, setCohort] = useState<DbCohort | null>(null);
  const [loading, setLoading] = useState(true);
  const [myStatus, setMyStatus] = useState<"requested" | "member" | "rejected" | null>(null);

  async function load() {
    const data = await getCohortById(params.id as string);
    setCohort(data);
    setLoading(false);
    if (data && currentUser) {
      const status = await getUserCohortStatus(data.id, currentUser.id);
      setMyStatus(status);
    }
  }

  useEffect(() => {
    load();
  }, [params.id, currentUser?.id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-sm" style={{ color: "#8b8b9e" }}>Loading cohort…</p>
      </div>
    );
  }

  if (!cohort) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-white font-medium mb-2">Cohort not found</p>
        <button onClick={() => router.push("/foundry")} className="text-sm" style={{ color: "#6633ee" }}>Back to Foundry</button>
      </div>
    );
  }

  const disc = getDisciplineById(cohort.discipline_id);
  const allMembers: DbMember[] = cohort.members ?? [];
  const acceptedMembers = allMembers.filter((m) => m.status === "member");
  const pendingRequests = allMembers.filter((m) => m.status === "requested");
  const spotsLeft = cohort.team_size - acceptedMembers.length;
  const canJoin = isAuthenticated && (currentUser?.verified ?? false);
  const isMember = myStatus === "member";
  const requested = myStatus === "requested";
  const isOwner = !!currentUser && currentUser.id === cohort.owner_id;
  const owner = cohort.owner;

  async function handleRequestToJoin() {
    if (!currentUser || !canJoin) return;
    const error = await requestToJoin(cohort!.id, currentUser.id);
    if (!error) setMyStatus("requested");
  }

  async function handleApprove(memberId: string) {
    await updateMemberStatus(memberId, "member");
    await load();
  }

  async function handleReject(memberId: string) {
    await updateMemberStatus(memberId, "rejected");
    await load();
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
        {cohort.description && (
          <p className="text-sm leading-relaxed" style={{ color: "#c4c4d4" }}>{cohort.description}</p>
        )}

        {owner && (
          <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: "1px solid #1e1e2e" }}>
            <VerifiedAvatar name={owner.name} avatarUrl={owner.avatar_url} verified={owner.verified} size="sm" />
            <span className="text-xs" style={{ color: "#8b8b9e" }}>
              Started by{" "}
              <Link href={`/profile/${owner.id}`} className="text-white hover:underline">
                {owner.name}
              </Link>
            </span>
          </div>
        )}
      </div>

      {/* Gate banners */}
      {!isAuthenticated && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm" style={{ backgroundColor: "#1a1a28", border: "1px solid #2e2e44" }}>
          <LogIn size={14} style={{ color: "#a78bfa" }} />
          <span style={{ color: "#8b8b9e" }}>Sign in to request to join this cohort.</span>
          <Link href="/login" className="ml-auto text-xs font-semibold flex-shrink-0" style={{ color: "#a78bfa" }}>Sign in →</Link>
        </div>
      )}
      {isAuthenticated && !currentUser?.verified && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm" style={{ backgroundColor: "#1a1208", border: "1px solid #5c3b12" }}>
          <ShieldAlert size={14} style={{ color: "#fb923c" }} />
          <span style={{ color: "#8b8b9e" }}>Verify your account to join this cohort.</span>
          <Link href={`/profile/${currentUser?.id}`} className="ml-auto text-xs font-semibold flex-shrink-0" style={{ color: "#fb923c" }}>Verify →</Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Pending requests — owner only */}
          {isOwner && (
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
              <h2 className="text-sm font-semibold text-white mb-4">
                Pending requests{pendingRequests.length > 0 ? ` (${pendingRequests.length})` : ""}
              </h2>
              {pendingRequests.length === 0 ? (
                <p className="text-xs" style={{ color: "#8b8b9e" }}>No pending requests right now.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {pendingRequests.map((req) => {
                    const p = req.profiles;
                    return (
                      <div key={req.id} className="flex items-center gap-3">
                        <VerifiedAvatar name={p.name} avatarUrl={p.avatar_url} verified={p.verified} size="sm" />
                        <div className="flex-1 min-w-0">
                          <Link href={`/profile/${p.id}`} className="text-sm font-medium text-white hover:underline">
                            {p.name}
                          </Link>
                          {p.major && <p className="text-xs truncate" style={{ color: "#8b8b9e" }}>{p.major}</p>}
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
              {(cohort.roles_open ?? []).length > 0 ? (
                (cohort.roles_open ?? []).map((role) => (
                  <span key={role} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: "#6633ee15", color: "#a78bfa", border: "1px solid #6633ee33" }}>
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
              <Users size={15} style={{ color: "#6633ee" }} />
              Members ({acceptedMembers.length}/{cohort.team_size})
            </h2>
            {acceptedMembers.length === 0 ? (
              <p className="text-xs" style={{ color: "#8b8b9e" }}>No members yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {acceptedMembers.map((m) => {
                  const p = m.profiles;
                  return (
                    <Link key={m.user_id} href={`/profile/${p.id}`} className="flex items-center gap-2">
                      <VerifiedAvatar name={p.name} avatarUrl={p.avatar_url} verified={p.verified} size="sm" />
                      <div>
                        <p className="text-xs font-medium text-white hover:underline">{p.name}</p>
                        {p.major && <p className="text-xs" style={{ color: "#8b8b9e" }}>{p.major.split(" ")[0]}</p>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Spots */}
          <div className="rounded-2xl border p-4 text-center" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
            <span className="text-2xl font-bold text-white">{spotsLeft}</span>
            <p className="text-xs mt-0.5" style={{ color: "#8b8b9e" }}>spot{spotsLeft !== 1 ? "s" : ""} open</p>
          </div>

          {/* CTA */}
          <button
            onClick={handleRequestToJoin}
            className={cn(
              "w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity flex items-center justify-center gap-1.5",
              isMember || requested || !canJoin || isOwner ? "text-white opacity-50 cursor-not-allowed" : "text-white hover:opacity-90"
            )}
            style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
            disabled={!canJoin || isMember || requested || isOwner}
          >
            {isOwner ? (
              "You own this cohort"
            ) : isMember ? (
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
