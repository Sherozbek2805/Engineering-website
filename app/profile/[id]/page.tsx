"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, GraduationCap, Trophy, Zap, Github, Linkedin, FolderOpen, ShieldAlert, ShieldCheck, Chrome, Pencil, Award, Activity } from "lucide-react";
import Link from "next/link";
import { getUserById } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { getProjectsByOwnerId, type DbProject } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import VerifiedAvatar from "@/components/VerifiedAvatar";
import ProjectCard from "@/components/ProjectCard";
import type { User } from "@/lib/mock-data";

const AVAILABILITY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  "Looking for projects": { bg: "bg-sky-500/15", text: "text-sky-400", dot: "bg-sky-400" },
  "Looking for team members": { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400" },
  "Looking for internship": { bg: "bg-amber-500/15", text: "text-amber-400", dot: "bg-amber-400" },
  "Not available": { bg: "bg-zinc-500/15", text: "text-zinc-400", dot: "bg-zinc-400" },
};

function rowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    name: (row.name as string) ?? "",
    email: (row.email as string) ?? "",
    school: (row.school as string) ?? "",
    country: (row.country as string) ?? "",
    region: (row.region as string) ?? "",
    major: (row.major as string) ?? "",
    bio: (row.bio as string) ?? "",
    avatarUrl: (row.avatar_url as string) ?? "",
    verified: (row.verified as boolean) ?? false,
    verificationProvider: row.verification_provider as "github" | "linkedin" | undefined,
    builderScore: (row.builder_score as number) ?? 0,
    skills: (row.skills as User["skills"]) ?? [],
    interests: (row.interests as string[]) ?? [],
    portfolio: (row.portfolio as User["portfolio"]) ?? [],
    extracurriculars: (row.extracurriculars as User["extracurriculars"]) ?? [],
    honors: (row.honors as User["honors"]) ?? [],
    githubUrl: (row.github_url as string) ?? "",
    linkedinUrl: (row.linkedin_url as string) ?? "",
    availability: (row.availability as User["availability"]) ?? "Not available",
    profileCompleted: (row.profile_completed as boolean) ?? false,
    role: (row.role as User["role"]) ?? "builder",
    projectIds: (row.project_ids as string[]) ?? [],
    joinedCommunityIds: (row.joined_community_ids as string[]) ?? [],
  };
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, verify, linkGoogle, isGoogleLinked } = useAuth();
  const profileId = params.id as string;

  const mockUser = getUserById(profileId);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [userProjects, setUserProjects] = useState<DbProject[]>([]);
  const [loading, setLoading] = useState(!mockUser);

  useEffect(() => {
    if (mockUser) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .single()
      .then(async ({ data }) => {
        if (data) {
          const u = rowToUser(data as Record<string, unknown>);
          setDbUser(u);
          const projs = await getProjectsByOwnerId(profileId);
          setUserProjects(projs);
        }
        setLoading(false);
      });
  }, [profileId]);

  const user = mockUser ?? dbUser;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-sm" style={{ color: "#8b8b9e" }}>Loading profile…</p>
      </div>
    );
  }

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

  const avail = AVAILABILITY_STYLES[user.availability] ?? AVAILABILITY_STYLES["Not available"];
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm transition-colors hover:text-white"
          style={{ color: "#8b8b9e" }}
        >
          <ArrowLeft size={15} /> Back
        </button>
        {isOwnProfile && (
          <Link
            href="/onboarding?from=profile"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e", color: "#a78bfa" }}
          >
            <Pencil size={13} /> Edit profile
          </Link>
        )}
      </div>

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
              {user.school && (
                <div className="flex items-center gap-2 text-xs" style={{ color: "#8b8b9e" }}>
                  <GraduationCap size={13} style={{ color: "#6633ee" }} /> {user.school}
                </div>
              )}
              {user.country && (
                <div className="flex items-center gap-2 text-xs" style={{ color: "#8b8b9e" }}>
                  <MapPin size={13} style={{ color: "#6633ee" }} /> {user.country}
                </div>
              )}
              {user.major && (
                <div className="flex items-center gap-2 text-xs" style={{ color: "#8b8b9e" }}>
                  <Zap size={13} style={{ color: "#6633ee" }} /> {user.major}
                </div>
              )}
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

            {/* Connect to verify — own profile, show remaining unconnected ones */}
            {isOwnProfile && (!user.githubUrl || !user.linkedinUrl) && (
              <div
                className="w-full rounded-xl p-4 flex flex-col gap-2"
                style={{ backgroundColor: "#1a1208", border: "1px solid #5c3b12" }}
              >
                <p className="text-xs font-semibold" style={{ color: "#fb923c" }}>
                  {user.verified ? "Add more social links" : "Connect to verify"}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#8b8b9e" }}>
                  {user.verified
                    ? "You're verified! Adding more links strengthens your profile."
                    : "Add your GitHub or LinkedIn URL in Edit Profile — either one is enough to verify."}
                </p>
                <div className="flex flex-col gap-1.5 mt-1">
                  {!user.githubUrl && (
                    <Link
                      href="/onboarding?from=profile"
                      className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#1a1a28", color: "#e2e2f0", border: "1px solid #2e2e44" }}
                    >
                      <Github size={13} /> Add GitHub URL
                    </Link>
                  )}
                  {!user.linkedinUrl && (
                    <Link
                      href="/onboarding?from=profile"
                      className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#0a1628", color: "#60a5fa", border: "1px solid #1e3a5f" }}
                    >
                      <Linkedin size={13} /> Add LinkedIn URL
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Google login link — own profile only */}
            {isOwnProfile && (
              <div
                className="w-full rounded-xl p-4 flex flex-col gap-2"
                style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e" }}
              >
                <p className="text-xs font-semibold text-white">Google login</p>
                {isGoogleLinked ? (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#14532d" }}>
                      <ShieldCheck size={11} className="text-green-400" />
                    </div>
                    <span className="text-xs" style={{ color: "#34d399" }}>Google account linked — you can log in with either method</span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs" style={{ color: "#8b8b9e" }}>
                      Link Google so you can sign in with either your password or Google.
                    </p>
                    <button
                      onClick={() => linkGoogle()}
                      className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90 mt-1"
                      style={{ backgroundColor: "#1a1208", color: "#fbbf24", border: "1px solid #5c3b12" }}
                    >
                      <Chrome size={13} /> Link Google account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Interests */}
          {user.interests.length > 0 && (
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
          )}

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

        {/* Right: skills + extracurriculars + honors + projects */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Skills */}
          {user.skills.length > 0 && (
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
          )}

          {/* Extracurricular Activities */}
          {user.extracurriculars?.length > 0 && (
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Activity size={14} style={{ color: "#6633ee" }} /> Extracurricular Activities
              </h2>
              <div className="flex flex-col gap-4">
                {user.extracurriculars.map((ec, i) => (
                  <div key={i} className="border-l-2 pl-4" style={{ borderColor: "#6633ee44" }}>
                    <p className="text-sm font-semibold text-white">{ec.name}</p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: "#a78bfa" }}>{ec.role}</p>
                    {ec.description && <p className="text-xs mt-1 leading-relaxed" style={{ color: "#8b8b9e" }}>{ec.description}</p>}
                    {(ec.hoursPerWeek || ec.yearsActive) && (
                      <p className="text-xs mt-1" style={{ color: "#5a5a6e" }}>
                        {ec.hoursPerWeek ? `${ec.hoursPerWeek}h/week` : ""}
                        {ec.hoursPerWeek && ec.yearsActive ? " · " : ""}
                        {ec.yearsActive}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Honors & Awards */}
          {user.honors?.length > 0 && (
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Award size={14} style={{ color: "#f59e0b" }} /> Honors &amp; Awards
              </h2>
              <div className="flex flex-col gap-4">
                {user.honors.map((h, i) => (
                  <div key={i} className="border-l-2 pl-4" style={{ borderColor: "#f59e0b44" }}>
                    <p className="text-sm font-semibold text-white">{h.name}</p>
                    {(h.organization || h.year) && (
                      <p className="text-xs mt-0.5" style={{ color: "#fbbf24" }}>
                        {h.organization}{h.organization && h.year ? " · " : ""}{h.year}
                      </p>
                    )}
                    {h.description && <p className="text-xs mt-1 leading-relaxed" style={{ color: "#8b8b9e" }}>{h.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

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
