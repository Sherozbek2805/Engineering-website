"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Plus, Lock, LogIn, CheckCircle2, Clock } from "lucide-react";
import {
  cohorts,
  getUserById,
  getDisciplineById,
  hasRequestedToJoin,
  requestToJoinCohort,
} from "@/lib/mock-data";
import VerifiedAvatar from "@/components/VerifiedAvatar";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export default function FoundryPage() {
  const { currentUser, isAuthenticated, profileCompleted } = useAuth();
  const [showForm, setShowForm] = useState(false);
  // Bump this after mutating the shared joinRequests array to force a re-render.
  const [, setTick] = useState(0);

  const canJoin = isAuthenticated && profileCompleted;

  function handleRequestToJoin(cohortId: string) {
    if (!currentUser || !canJoin) return;
    requestToJoinCohort(cohortId, currentUser.id);
    setTick((t) => t + 1);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Foundry</h1>
          <p className="text-sm" style={{ color: "#8b8b9e" }}>
            Open cohorts looking for builders. Request to join or start your own.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0 transition-opacity",
            canJoin ? "text-white hover:opacity-90" : "opacity-50 cursor-not-allowed text-white"
          )}
          style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
          title={!canJoin ? "Complete your profile first" : undefined}
          disabled={!canJoin}
        >
          <Plus size={15} />
          Start a cohort
        </button>
      </div>

      {/* Gate banner */}
      {!isAuthenticated && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm"
          style={{ backgroundColor: "#1a1a28", border: "1px solid #2e2e44" }}
        >
          <LogIn size={14} style={{ color: "#a78bfa" }} />
          <span style={{ color: "#8b8b9e" }}>
            Sign in to start a cohort or request to join one.
          </span>
          <Link href="/login" className="ml-auto text-xs font-semibold flex-shrink-0" style={{ color: "#a78bfa" }}>
            Sign in →
          </Link>
        </div>
      )}
      {isAuthenticated && !profileCompleted && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm"
          style={{ backgroundColor: "#1a1a28", border: "1px solid #2e2e44" }}
        >
          <Lock size={14} style={{ color: "#a78bfa" }} />
          <span style={{ color: "#8b8b9e" }}>
            Complete your profile to start a cohort or request to join one.
          </span>
          <Link href="/onboarding" className="ml-auto text-xs font-semibold flex-shrink-0" style={{ color: "#a78bfa" }}>
            Complete →
          </Link>
        </div>
      )}

      {/* Cohort cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cohorts.map((cohort) => {
          const disc = getDisciplineById(cohort.disciplineId);
          const members = cohort.memberIds.map(getUserById).filter(Boolean);
          const spotsLeft = cohort.teamSize - cohort.memberIds.length;
          const isMember = !!currentUser && cohort.memberIds.includes(currentUser.id);
          const requested = !!currentUser && hasRequestedToJoin(cohort.id, currentUser.id);

          return (
            <div
              key={cohort.id}
              className="rounded-2xl border p-5 flex flex-col gap-4"
              style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
            >
              {/* Discipline badge */}
              {disc && (
                <span
                  className="self-start text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: disc.color + "22", color: disc.color }}
                >
                  {disc.name}
                </span>
              )}

              {/* Title + goal */}
              <div>
                <Link href={`/foundry/${cohort.id}`} className="text-sm font-bold text-white mb-1.5 block hover:underline">
                  {cohort.title}
                </Link>
                <p className="text-xs leading-relaxed" style={{ color: "#c4c4d4" }}>
                  {cohort.goal}
                </p>
              </div>

              {/* Members */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs flex items-center gap-1" style={{ color: "#8b8b9e" }}>
                    <Users size={12} />
                    {cohort.memberIds.length}/{cohort.teamSize} members
                  </span>
                  <span className="text-xs font-medium" style={{ color: spotsLeft > 0 ? "#6633ee" : "#8b8b9e" }}>
                    {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} open` : "Full"}
                  </span>
                </div>
                <div className="flex -space-x-1.5">
                  {members.map((m) =>
                    m ? <VerifiedAvatar key={m.id} name={m.name} avatarUrl={m.avatarUrl} verified={m.verified} size="sm" /> : null
                  )}
                  {Array.from({ length: Math.max(0, spotsLeft) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                      style={{ backgroundColor: "#1a1a28", border: "2px dashed #2e2e44", color: "#8b8b9e" }}
                    >
                      ?
                    </div>
                  ))}
                </div>
              </div>

              {/* Open roles */}
              {cohort.rolesOpen.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {cohort.rolesOpen.map((role) => (
                    <span
                      key={role}
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: "#6633ee22", color: "#a78bfa", border: "1px solid #6633ee44" }}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <button
                onClick={() => handleRequestToJoin(cohort.id)}
                className={cn(
                  "mt-auto w-full py-2 rounded-xl text-xs font-semibold transition-opacity flex items-center justify-center gap-1.5",
                  isMember || requested || !canJoin ? "text-white opacity-50 cursor-not-allowed" : "text-white hover:opacity-90"
                )}
                style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
                disabled={!canJoin || isMember || requested}
              >
                {isMember ? (
                  <><CheckCircle2 size={13} /> You&apos;re a member</>
                ) : requested ? (
                  <><Clock size={13} /> Requested</>
                ) : (
                  "Request to join"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
