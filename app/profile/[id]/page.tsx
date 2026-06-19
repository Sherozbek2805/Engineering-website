"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, GraduationCap, Trophy, Zap, Github, Linkedin, FolderOpen, ShieldAlert, ShieldCheck } from "lucide-react";
import { getUserById, getProjectsByIds } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import VerifiedAvatar from "@/components/VerifiedAvatar";
import ProjectCard from "@/components/ProjectCard";

const AVAILABILITY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  "Looking for projects": { bg: "bg-sky-500/15", text: "text-sky-400", dot: "bg-sky-400" },
  "Looking for team members": { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400" },
  "Looking for internship": { bg: "bg-amber-500/15", text: "text-amber-400", dot: "bg-amber-400" },
  "Not available": { bg: "bg-zinc-500/15", text: "text-zinc-400", dot: "bg-zinc-400" },
};

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, verify } = useAuth();
  const user = getUserById(params.id as string);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-white font-medium mb-2">User not found</p>
        <button onClick={() => router.push("/engineering")} className="text-sm" style={{ color: "#6633ee" }}>
          Back to Engineering
        </button>
      </div>
    );
  }

  const userProjects = getProjectsByIds(user.projectIds);
  const avail = AVAILABILITY_STYLES[user.availability];
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: "#8b8b9e" }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: identity card */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div
            className="rounded-2xl border p-6 flex flex-col items-center text-center gap-4"
            style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
          >
            <VerifiedAvatar name={user.name} avatarUrl={user.avatarUrl} verified={user.verified} size="xl" />

            <div>
              <h1 className="text-base font-bold text-white mb-1">{user.name}</h1>
              {user.verified ? (
                <span
                  className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: "linear-gradient(135deg, #6633ee22, #7744ff22)", color: "#a78bfa", border: "1px solid #6633ee44" }}
                >
                  <ShieldCheck size={11} /> Verified builder
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#2a1f0a", color: "#fb923c", border: "1px solid #5c3b12" }}
                >
                  <ShieldAlert size={11} /> Unverified
                </span>
              )}
            </div>

            {user.bio && (
              <p className="text-xs leading-relaxed" style={{ color: "#c4c4d4" }}>{user.bio}</p>
            )}

            <div className="flex flex-col gap-1 w-full text-left">
              <div className="flex items-center gap-2 text-xs" style={{ color: "#8b8b9e" }}>
                <GraduationCap size={13} style={{ color: "#6633ee" }} /> {user.school}
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: "#8b8b9e" }}>
                <MapPin size={13} style={{ color: "#6633ee" }} /> {user.country}
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: "#8b8b9e" }}>
                <Zap size={13} style={{ color: "#6633ee" }} /> {user.major}
              </div>
            </div>

            {/* Builder score */}
            <div
              className="w-full rounded-xl p-3 text-center"
              style={{ background: "linear-gradient(135deg, #6633ee15, #7744ff15)", border: "1px solid #6633ee33" }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Trophy size={14} style={{ color: "#a78bfa" }} />
                <span className="text-xl font-bold text-white">{user.builderScore}</span>
              </div>
              <span className="text-xs" style={{ color: "#a78bfa" }}>Builder Score</span>
            </div>

            {/* Availability */}
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${avail.bg} ${avail.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
              {user.availability}
            </span>

            {/* Social links */}
            {(user.githubUrl || user.linkedinUrl) && (
              <div className="flex items-center gap-2">
                {user.githubUrl && (
                  <a href={user.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[#1a1a28]"
                    style={{ color: "#8b8b9e" }}
                  >
                    <Github size={15} />
                  </a>
                )}
                {user.linkedinUrl && (
                  <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[#1a1a28]"
                    style={{ color: "#8b8b9e" }}
                  >
                    <Linkedin size={15} />
                  </a>
                )}
              </div>
            )}

            {/* Connect to verify — own profile only, if not yet verified */}
            {isOwnProfile && !user.verified && (
              <div
                className="w-full rounded-xl p-4 flex flex-col gap-2"
                style={{ backgroundColor: "#1a1208", border: "1px solid #5c3b12" }}
              >
                <p className="text-xs font-semibold" style={{ color: "#fb923c" }}>Connect to verify</p>
                <p className="text-xs leading-relaxed" style={{ color: "#8b8b9e" }}>
                  Verified builders can join Foundry cohorts and message others.
                </p>
                <div className="flex flex-col gap-1.5 mt-1">
                  <button
                    onClick={() => verify("github")}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#1a1a28", color: "#e2e2f0", border: "1px solid #2e2e44" }}
                  >
                    <Github size={13} /> Connect GitHub
                  </button>
                  <button
                    onClick={() => verify("linkedin")}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#0a1628", color: "#60a5fa", border: "1px solid #1e3a5f" }}
                  >
                    <Linkedin size={13} /> Connect LinkedIn
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
            <h2 className="text-sm font-semibold text-white mb-3">Interests</h2>
            <div className="flex flex-wrap gap-1.5">
              {user.interests.map((interest) => (
                <span key={interest} className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "#1a1a28", color: "#8b8b9e" }}>
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          {user.portfolio.length > 0 && (
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <FolderOpen size={14} style={{ color: "#6633ee" }} /> Portfolio
              </h2>
              <div className="flex flex-col gap-2">
                {user.portfolio.map((item) => (
                  <a key={item.title} href={item.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs hover:underline truncate" style={{ color: "#a78bfa" }}
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: skills + projects */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Skills */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
            <h2 className="text-sm font-semibold text-white mb-4">Skills</h2>
            <div className="flex flex-col gap-3">
              {user.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white">{skill.name}</span>
                    <span className="text-xs font-semibold" style={{ color: "#a78bfa" }}>{skill.rating}/10</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#1e1e2e" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(skill.rating / 10) * 100}%`,
                        background: skill.rating >= 8
                          ? "linear-gradient(90deg, #6633ee, #a855f7)"
                          : skill.rating >= 6
                          ? "linear-gradient(90deg, #3b82f6, #6366f1)"
                          : "linear-gradient(90deg, #0ea5e9, #3b82f6)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-sm font-semibold text-white mb-3">Projects</h2>
            {userProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
                <p className="text-sm" style={{ color: "#8b8b9e" }}>No projects yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
