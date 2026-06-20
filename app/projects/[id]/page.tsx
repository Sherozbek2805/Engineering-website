"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, CheckCircle2, Circle, ChevronUp,
  Cpu, Code2, Users, CheckCheck,
} from "lucide-react";
import { getProjectById, type DbProject } from "@/lib/db";
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

  const [project, setProject] = useState<DbProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    getProjectById(params.id as string).then((data) => {
      setProject(data);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-sm" style={{ color: "#8b8b9e" }}>Loading project…</p>
      </div>
    );
  }

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

  const owner = project.owner;
  const stage = STAGE_STYLES[project.stage] ?? STAGE_STYLES.Idea;
  const votes = upvoteCount ?? (project.upvotes ?? 0);
  const milestones = project.milestones ?? [];
  const doneCount = milestones.filter((m) => m.done).length;
  const lookingFor = project.looking_for ?? [];
  const tags = project.tags ?? [];

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
        <ArrowLeft size={15} /> Back
      </button>

      {/* Header */}
      <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn("inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full",
                project.kind === "hardware" ? "bg-orange-500/15 text-orange-400" : "bg-sky-500/15 text-sky-400"
              )}
            >
              {project.kind === "hardware" ? <Cpu size={12} /> : <Code2 size={12} />}
              {project.kind === "hardware" ? "Hardware" : "Software"}
            </span>
            <span className={cn("inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full", stage.bg, stage.text)}>
              {project.stage}
            </span>
            {project.finished && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
                <CheckCheck size={12} /> Finished
              </span>
            )}
          </div>
          <button
            onClick={handleUpvote}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold flex-shrink-0 transition-all"
            style={upvoted
              ? { background: "linear-gradient(135deg, #6633ee22, #7744ff22)", color: "#a78bfa", border: "1px solid #6633ee44" }
              : { backgroundColor: "#1a1a28", color: "#8b8b9e", border: "1px solid #1e1e2e" }
            }
          >
            <ChevronUp size={16} />
            {votes}
          </button>
        </div>

        <h1 className="text-xl font-bold text-white mb-3 leading-snug">{project.title}</h1>
        <p className="text-sm leading-relaxed mb-5" style={{ color: "#c4c4d4" }}>{project.description}</p>

        {owner && (
          <div className="flex items-center gap-2 mb-4 pb-4" style={{ borderBottom: "1px solid #1e1e2e" }}>
            <VerifiedAvatar name={owner.name} avatarUrl={owner.avatar_url} verified={owner.verified} size="sm" />
            <span className="text-xs" style={{ color: "#8b8b9e" }}>by <span className="text-white">{owner.name}</span></span>
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium" style={{ color: "#8b8b9e" }}>Progress</span>
            <span className="text-xs font-bold text-white">{project.progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#1e1e2e" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${project.progress}%`, background: "linear-gradient(90deg, #6633ee, #a855f7)" }}
            />
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "#1a1a28", color: "#8b8b9e" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Looking for / Apply */}
      {lookingFor.length > 0 && (
        <div className="rounded-2xl border p-5 mb-6" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Users size={15} style={{ color: "#6633ee" }} /> Looking for
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {lookingFor.map((role) => (
              <span key={role} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: "#6633ee15", color: "#a78bfa", border: "1px solid #6633ee33" }}>
                {role}
              </span>
            ))}
          </div>
          {profileCompleted ? (
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
            >
              Apply to join
            </button>
          ) : (
            <ProfileGate action="apply to projects" />
          )}
          {showToast && (
            <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: "#34d399" }}>
              <CheckCircle2 size={13} /> Application sent!
            </div>
          )}
        </div>
      )}

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            Milestones
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1a1a28", color: "#8b8b9e" }}>
              {doneCount}/{milestones.length}
            </span>
          </h2>
          <div className="flex flex-col gap-2.5">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                {m.done
                  ? <CheckCircle2 size={16} style={{ color: "#34d399", flexShrink: 0 }} />
                  : <Circle size={16} style={{ color: "#2e2e44", flexShrink: 0 }} />
                }
                <span className="text-sm" style={{ color: m.done ? "#c4c4d4" : "#8b8b9e", textDecoration: m.done ? "line-through" : "none" }}>
                  {m.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
