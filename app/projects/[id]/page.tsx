"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, CheckCircle2, Circle, ChevronUp,
  Cpu, Code2, Users, CheckCheck,
} from "lucide-react";
import { getProjectById, getUserById } from "@/lib/mock-data";
import VerifiedAvatar from "@/components/VerifiedAvatar";
import ProfileGate from "@/components/ProfileGate";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const STAGE_STYLES: Record<string, { bg: string; text: string }> = {
  Idea: { bg: "bg-blue-500/15", text: "text-blue-400" },
  Prototype: { bg: "bg-amber-500/15", text: "text-amber-400" },
  Testing: { bg: "bg-orange-500/15", text: "text-orange-400" },
  Final: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { profileCompleted } = useAuth();
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  const project = getProjectById(params.id as string);
  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-white font-medium mb-2">Project not found</p>
        <button onClick={() => router.push("/engineering")} className="text-sm" style={{ color: "#6633ee" }}>
          Back to projects
        </button>
      </div>
    );
  }

  const owner = getUserById(project.ownerId);
  const teamMembers = project.teamMemberIds.map((id) => getUserById(id)).filter(Boolean);
  const stage = STAGE_STYLES[project.stage] ?? STAGE_STYLES.Idea;
  const votes = upvoteCount ?? project.upvotes;
  const doneCount = project.milestones.filter((m) => m.done).length;

  function handleUpvote() {
    setUpvoteCount(upvoted ? votes - 1 : votes + 1);
    setUpvoted((v) => !v);
  }

  function handleApply() {
    if (!profileCompleted) return;
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: "#8b8b9e" }}
      >
        <ArrowLeft size={15} /> Back to projects
      </button>

      {/* Header card */}
      <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
        <div className="flex items-center gap-2 mb-4">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full",
              project.kind === "hardware" ? "bg-orange-500/15 text-orange-400" : "bg-sky-500/15 text-sky-400"
            )}
          >
            {project.kind === "hardware" ? <Cpu size={11} /> : <Code2 size={11} />}
            {project.kind === "hardware" ? "Hardware" : "Software"}
          </span>
          <span className={cn("inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full", stage.bg, stage.text)}>
            {project.stage}
          </span>
          {project.finished && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 size={11} /> Finished
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold text-white mb-3 leading-snug">{project.title}</h1>

        {owner && (
          <div className="flex items-center gap-2 mb-4">
            <VerifiedAvatar name={owner.name} verified={owner.verified} size="sm" />
            <span className="text-sm" style={{ color: "#8b8b9e" }}>
              by{" "}
              <span onClick={() => router.push(`/profile/${owner.id}`)} className="text-white hover:underline cursor-pointer">
                {owner.name}
              </span>
            </span>
          </div>
        )}

        <p className="text-sm leading-relaxed" style={{ color: "#c4c4d4" }}>{project.description}</p>

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1a1a28", color: "#8b8b9e" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 mt-5 pt-4" style={{ borderTop: "1px solid #1e1e2e" }}>
          <button
            onClick={handleUpvote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ backgroundColor: upvoted ? "#6633ee22" : "#1a1a28", color: upvoted ? "#a78bfa" : "#8b8b9e" }}
          >
            <ChevronUp size={16} /> {votes} upvotes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Progress */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
            <h2 className="text-sm font-semibold text-white mb-4">Progress</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs" style={{ color: "#8b8b9e" }}>Overall completion</span>
              <span className="text-lg font-bold text-white">{project.progress}%</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#1e1e2e" }}>
              <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: "linear-gradient(90deg, #6633ee, #a855f7)" }} />
            </div>
          </div>

          {/* Milestones */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Milestones</h2>
              <span className="text-xs" style={{ color: "#8b8b9e" }}>{doneCount} / {project.milestones.length} done</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {project.milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  {m.done
                    ? <CheckCircle2 size={17} style={{ color: "#6633ee", flexShrink: 0 }} />
                    : <Circle size={17} style={{ color: "#1e1e2e", flexShrink: 0 }} />
                  }
                  <span className="text-sm" style={{ color: m.done ? "#c4c4d4" : "#8b8b9e" }}>{m.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Updates */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
            <h2 className="text-sm font-semibold text-white mb-4">Weekly updates</h2>
            <div className="flex flex-col gap-0">
              {project.updates.map((u, i) => (
                <div key={i} className="flex gap-4 pb-5 relative">
                  {i < project.updates.length - 1 && (
                    <div className="absolute left-[7px] top-5 w-px h-full" style={{ backgroundColor: "#1e1e2e" }} />
                  )}
                  <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 mt-0.5"
                    style={{ background: i === 0 ? "linear-gradient(135deg, #6633ee, #a855f7)" : "#1e1e2e", border: i !== 0 ? "2px solid #2e2e44" : "none" }}
                  />
                  <div>
                    <span className="text-xs font-semibold block mb-1" style={{ color: "#6633ee" }}>Week {u.week}</span>
                    <p className="text-sm leading-relaxed" style={{ color: "#c4c4d4" }}>{u.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Team */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Users size={15} style={{ color: "#6633ee" }} /> Team
            </h2>
            <div className="flex flex-col gap-3">
              {teamMembers.map((member) =>
                member ? (
                  <div key={member.id} className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(`/profile/${member.id}`)}>
                    <VerifiedAvatar name={member.name} verified={member.verified} size="sm" />
                    <div>
                      <p className="text-xs font-medium text-white hover:underline">{member.name}</p>
                      <p className="text-xs" style={{ color: "#8b8b9e" }}>{member.major.split(" ")[0]}</p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>

          {/* Looking for */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
            <h2 className="text-sm font-semibold text-white mb-3">Looking for</h2>
            <div className="flex flex-col gap-2">
              {project.lookingFor.map((role) => (
                <span key={role} className="text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{ backgroundColor: "#6633ee15", color: "#a78bfa", border: "1px solid #6633ee33" }}
                >
                  {role}
                </span>
              ))}
            </div>

            <div className="mt-4">
              {profileCompleted ? (
                <button
                  onClick={handleApply}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
                >
                  <CheckCheck size={15} /> Apply to join
                </button>
              ) : (
                <ProfileGate action="apply to a project" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white shadow-2xl z-50"
          style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
        >
          <CheckCircle2 size={16} /> Application submitted! The team will reach out soon.
        </div>
      )}
    </div>
  );
}
