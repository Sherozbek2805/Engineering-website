"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronUp, Cpu, Code2 } from "lucide-react";
import type { DbProject } from "@/lib/db";
import VerifiedAvatar from "./VerifiedAvatar";
import { cn } from "@/lib/utils";

const STAGE_STYLES: Record<string, { bg: string; text: string }> = {
  Idea: { bg: "bg-blue-500/15", text: "text-blue-400" },
  Prototype: { bg: "bg-amber-500/15", text: "text-amber-400" },
  Testing: { bg: "bg-orange-500/15", text: "text-orange-400" },
  Final: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
};

export default function ProjectCard({ project }: { project: DbProject }) {
  const [upvotes, setUpvotes] = useState(project.upvotes ?? 0);
  const [upvoted, setUpvoted] = useState(false);
  const owner = project.owner;
  const stage = STAGE_STYLES[project.stage] ?? STAGE_STYLES.Idea;
  const lookingFor = project.looking_for ?? [];
  const tags = project.tags ?? [];

  function handleUpvote(e: React.MouseEvent) {
    e.preventDefault();
    setUpvotes((v) => (upvoted ? v - 1 : v + 1));
    setUpvoted((v) => !v);
  }

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <div
        className="rounded-2xl border p-5 flex flex-col gap-4 h-full transition-colors cursor-pointer"
        style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2e2e44")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
      >
        {/* Top row */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
              project.kind === "hardware" ? "bg-orange-500/15 text-orange-400" : "bg-sky-500/15 text-sky-400"
            )}
          >
            {project.kind === "hardware" ? <Cpu size={11} /> : <Code2 size={11} />}
            {project.kind === "hardware" ? "Hardware" : "Software"}
          </span>
          <span className={cn("inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full", stage.bg, stage.text)}>
            {project.stage}
          </span>
        </div>

        {/* Title + owner */}
        <div>
          <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#a78bfa] transition-colors">
            {project.title}
          </h3>
          {owner && (
            <div className="flex items-center gap-1.5 mt-2">
              <VerifiedAvatar name={owner.name} avatarUrl={owner.avatar_url} verified={owner.verified} size="sm" />
              <span className="text-xs" style={{ color: "#8b8b9e" }}>{owner.name}</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs" style={{ color: "#8b8b9e" }}>Progress</span>
            <span className="text-xs font-medium text-white">{project.progress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#1e1e2e" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${project.progress}%`, background: "linear-gradient(90deg, #6633ee, #a855f7)" }}
            />
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1a1a28", color: "#8b8b9e" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-end justify-between gap-2 mt-auto pt-1">
          <div className="flex flex-wrap gap-1">
            {lookingFor.slice(0, 2).map((role) => (
              <span
                key={role}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: "#6633ee22", color: "#a78bfa", border: "1px solid #6633ee44" }}
              >
                {role}
              </span>
            ))}
            {lookingFor.length > 2 && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1a1a28", color: "#8b8b9e" }}>
                +{lookingFor.length - 2}
              </span>
            )}
          </div>
          <button
            onClick={handleUpvote}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex-shrink-0"
            style={{ backgroundColor: upvoted ? "#6633ee22" : "#1a1a28", color: upvoted ? "#a78bfa" : "#8b8b9e" }}
          >
            <ChevronUp size={14} />
            {upvotes}
          </button>
        </div>
      </div>
    </Link>
  );
}
