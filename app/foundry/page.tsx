"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Plus, ShieldAlert, LogIn, CheckCircle2, Clock, X } from "lucide-react";
import { disciplines, getDisciplineById } from "@/lib/mock-data";
import {
  getAllCohorts, createCohort, requestToJoin, getUserCohortStatus,
  type DbCohort,
} from "@/lib/db";
import VerifiedAvatar from "@/components/VerifiedAvatar";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export default function FoundryPage() {
  const { currentUser, isAuthenticated } = useAuth();

  const [cohorts, setCohorts] = useState<DbCohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<Record<string, "requested" | "member" | "rejected" | null>>({});
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Create-cohort form fields
  const [formTitle, setFormTitle] = useState("");
  const [formGoal, setFormGoal] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formDiscipline, setFormDiscipline] = useState("");
  const [formTeamSize, setFormTeamSize] = useState(4);
  const [formRoles, setFormRoles] = useState("");

  const canJoin = isAuthenticated && (currentUser?.verified ?? false);

  async function loadCohorts() {
    setLoading(true);
    const data = await getAllCohorts();
    setCohorts(data);
    setLoading(false);

    // Load join status for current user in parallel
    if (currentUser) {
      const entries = await Promise.all(
        data.map(async (c) => {
          const status = await getUserCohortStatus(c.id, currentUser.id);
          return [c.id, status] as const;
        })
      );
      setStatuses(Object.fromEntries(entries));
    }
  }

  useEffect(() => {
    loadCohorts();
  }, [currentUser?.id]);

  async function handleRequestToJoin(cohortId: string) {
    if (!currentUser || !canJoin) return;
    const error = await requestToJoin(cohortId, currentUser.id);
    if (!error) {
      setStatuses((s) => ({ ...s, [cohortId]: "requested" }));
    }
  }

  async function handleCreateCohort(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser || !canJoin) return;
    setCreateError("");
    setCreating(true);
    const result = await createCohort({
      title: formTitle,
      goal: formGoal,
      description: formDesc,
      disciplineId: formDiscipline,
      teamSize: formTeamSize,
      rolesOpen: formRoles.split(",").map((r) => r.trim()).filter(Boolean),
      ownerId: currentUser.id,
    });
    setCreating(false);
    if (result.error) { setCreateError(result.error); return; }
    // Reset form and reload
    setShowForm(false);
    setFormTitle(""); setFormGoal(""); setFormDesc(""); setFormDiscipline(""); setFormRoles(""); setFormTeamSize(4);
    await loadCohorts();
  }

  const inputStyle = { backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e", color: "#ffffff", borderRadius: "12px" };

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
          disabled={!canJoin}
        >
          <Plus size={15} />
          Start a cohort
        </button>
      </div>

      {/* Gate banners */}
      {!isAuthenticated && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm" style={{ backgroundColor: "#1a1a28", border: "1px solid #2e2e44" }}>
          <LogIn size={14} style={{ color: "#a78bfa" }} />
          <span style={{ color: "#8b8b9e" }}>Sign in to start a cohort or request to join one.</span>
          <Link href="/login" className="ml-auto text-xs font-semibold flex-shrink-0" style={{ color: "#a78bfa" }}>Sign in →</Link>
        </div>
      )}
      {isAuthenticated && !currentUser?.verified && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm" style={{ backgroundColor: "#1a1208", border: "1px solid #5c3b12" }}>
          <ShieldAlert size={14} style={{ color: "#fb923c" }} />
          <span style={{ color: "#8b8b9e" }}>Verify your account to start or join a cohort. Connect GitHub or LinkedIn from your profile.</span>
          <Link href={`/profile/${currentUser?.id}`} className="ml-auto text-xs font-semibold flex-shrink-0" style={{ color: "#fb923c" }}>Verify →</Link>
        </div>
      )}

      {/* Create cohort form */}
      {showForm && canJoin && (
        <div className="rounded-2xl border p-6 mb-8" style={{ backgroundColor: "#111118", borderColor: "#6633ee" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Start a cohort</h2>
            <button onClick={() => setShowForm(false)} className="p-1" style={{ color: "#8b8b9e" }}><X size={16} /></button>
          </div>
          <form onSubmit={handleCreateCohort} className="flex flex-col gap-4">
            {createError && (
              <div className="px-4 py-3 rounded-xl text-xs" style={{ backgroundColor: "#3f1d1d", border: "1px solid #5c2424", color: "#f87171" }}>{createError}</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "#8b8b9e" }}>Title *</label>
                <input required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Build an autonomous drone" className="px-3 py-2.5 text-sm outline-none" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#6633ee")} onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "#8b8b9e" }}>Discipline *</label>
                <select required value={formDiscipline} onChange={(e) => setFormDiscipline(e.target.value)} className="px-3 py-2.5 text-sm outline-none" style={inputStyle}>
                  <option value="">Select…</option>
                  {disciplines.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "#8b8b9e" }}>Goal (one line) *</label>
              <input required value={formGoal} onChange={(e) => setFormGoal(e.target.value)} placeholder="What will the team build or achieve?" className="px-3 py-2.5 text-sm outline-none" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6633ee")} onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "#8b8b9e" }}>Description</label>
              <textarea rows={3} value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="More context, timeline, expectations…" className="px-3 py-2.5 text-sm outline-none resize-none" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6633ee")} onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "#8b8b9e" }}>Team size</label>
                <input type="number" min={2} max={20} value={formTeamSize} onChange={(e) => setFormTeamSize(Number(e.target.value))} className="px-3 py-2.5 text-sm outline-none" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#6633ee")} onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "#8b8b9e" }}>Open roles (comma-separated)</label>
                <input value={formRoles} onChange={(e) => setFormRoles(e.target.value)} placeholder="e.g. Backend Dev, PCB Designer" className="px-3 py-2.5 text-sm outline-none" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#6633ee")} onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-xs font-medium" style={{ backgroundColor: "#1a1a28", color: "#8b8b9e" }}>Cancel</button>
              <button type="submit" disabled={creating} className="px-5 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-60" style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}>
                {creating ? "Creating…" : "Create cohort"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cohort cards */}
      {loading ? (
        <p className="text-center py-16 text-sm" style={{ color: "#8b8b9e" }}>Loading cohorts…</p>
      ) : cohorts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white font-medium mb-1">No cohorts yet</p>
          <p className="text-sm" style={{ color: "#8b8b9e" }}>Be the first to start one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cohorts.map((cohort) => {
            const disc = cohort.discipline_id ? getDisciplineById(cohort.discipline_id) : undefined;
            const acceptedMembers = (cohort.members ?? []).filter((m) => m.status === "member");
            const spotsLeft = cohort.team_size - acceptedMembers.length;
            const myStatus = statuses[cohort.id] ?? null;
            const isMember = myStatus === "member";
            const requested = myStatus === "requested";

            return (
              <div key={cohort.id} className="rounded-2xl border p-5 flex flex-col gap-4" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
                {disc && (
                  <span className="self-start text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: disc.color + "22", color: disc.color }}>
                    {disc.name}
                  </span>
                )}

                <div>
                  <Link href={`/foundry/${cohort.id}`} className="text-sm font-bold text-white mb-1.5 block hover:underline">
                    {cohort.title}
                  </Link>
                  <p className="text-xs leading-relaxed" style={{ color: "#c4c4d4" }}>{cohort.goal}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs flex items-center gap-1" style={{ color: "#8b8b9e" }}>
                      <Users size={12} />
                      {acceptedMembers.length}/{cohort.team_size} members
                    </span>
                    <span className="text-xs font-medium" style={{ color: spotsLeft > 0 ? "#6633ee" : "#8b8b9e" }}>
                      {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} open` : "Full"}
                    </span>
                  </div>
                  <div className="flex -space-x-1.5">
                    {acceptedMembers.map((m) => (
                      <VerifiedAvatar key={m.user_id} name={m.profiles.name} avatarUrl={m.profiles.avatar_url} verified={m.profiles.verified} size="sm" />
                    ))}
                    {Array.from({ length: Math.max(0, spotsLeft) }).map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: "#1a1a28", border: "2px dashed #2e2e44", color: "#8b8b9e" }}>?</div>
                    ))}
                  </div>
                </div>

                {(cohort.roles_open ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {(cohort.roles_open ?? []).map((role) => (
                      <span key={role} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "#6633ee22", color: "#a78bfa", border: "1px solid #6633ee44" }}>
                        {role}
                      </span>
                    ))}
                  </div>
                )}

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
      )}
    </div>
  );
}
