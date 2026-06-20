"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Plane, Settings2, Zap, Building2, FlaskConical,
  Code2, Bot, Heart, Layers, Leaf,
  ArrowLeft, ExternalLink, ChevronUp, ChevronDown,
  Cpu, BookOpen, MessageSquare, Archive, Briefcase,
  CheckCircle2, Globe, Calendar,
} from "lucide-react";
import {
  getDisciplineBySlug, getResourcesByDiscipline,
  getOpportunitiesByDiscipline, getCommunityByDiscipline, FIELD_TOOLS,
} from "@/lib/mock-data";
import { getProjectsByDisciplineId, type DbProject } from "@/lib/db";
import ProjectCard from "@/components/ProjectCard";
import ThreadedComments from "@/components/ThreadedComments";
import ProfileGate from "@/components/ProfileGate";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  Plane, Settings2, Zap, Building2, FlaskConical, Code2, Bot, Heart, Layers, Leaf,
};

type Tab = "projects" | "tools" | "qa" | "research";
type ProjectFilter = "all" | "hardware" | "software" | "finished";

function formatDeadline(d: string) {
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

export default function DisciplinePage() {
  const params = useParams();
  const router = useRouter();
  const { profileCompleted } = useAuth();

  const slug = params.discipline as string;
  const disc = getDisciplineBySlug(slug);

  const [tab, setTab] = useState<Tab>("projects");
  const [projFilter, setProjFilter] = useState<ProjectFilter>("all");
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [projLoading, setProjLoading] = useState(true);
  const [expandedQA, setExpandedQA] = useState<string | null>(null);
  const [qaVotes, setQaVotes] = useState<Record<string, number>>({});
  const [qaVoteState, setQaVoteState] = useState<Record<string, "up" | "down" | null>>({});
  const [resourceVotes, setResourceVotes] = useState<Record<string, number>>({});
  const [showAskForm, setShowAskForm] = useState(false);

  useEffect(() => {
    if (!disc) return;
    setProjLoading(true);
    getProjectsByDisciplineId(disc.id).then((data) => {
      setProjects(data);
      setProjLoading(false);
    });
  }, [disc?.id]);

  if (!disc) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-white font-medium mb-2">Discipline not found</p>
        <button onClick={() => router.push("/engineering")} className="text-sm" style={{ color: "#6633ee" }}>
          ← Back to Engineering
        </button>
      </div>
    );
  }

  const Icon = ICON_MAP[disc.icon] ?? Code2;
  const filteredProjects =
    projFilter === "all" ? projects :
    projFilter === "finished" ? projects.filter((p) => p.finished) :
    projects.filter((p) => p.kind === projFilter && !p.finished);

  const qaPosts: never[] = [];
  const resources = getResourcesByDiscipline(disc.id);
  const opps = getOpportunitiesByDiscipline(disc.id);
  const tools = FIELD_TOOLS[slug] ?? [];
  const community = getCommunityByDiscipline(disc.id);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "projects", label: "Projects", icon: Cpu },
    { id: "tools", label: "Field Tools", icon: BookOpen },
    { id: "qa", label: "Q&A", icon: MessageSquare },
    { id: "research", label: "Research", icon: Archive },
  ];

  const filterOptions: { value: ProjectFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "hardware", label: "Hardware" },
    { value: "software", label: "Software" },
    { value: "finished", label: "Finished" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button
        onClick={() => router.push("/engineering")}
        className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: "#8b8b9e" }}
      >
        <ArrowLeft size={15} /> All disciplines
      </button>

      {/* Discipline header */}
      <div
        className="rounded-2xl border p-6 mb-6"
        style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: disc.color + "22" }}
          >
            <Icon size={28} style={{ color: disc.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white mb-1">{disc.name}</h1>
            <p className="text-sm mb-3" style={{ color: "#8b8b9e" }}>{disc.description}</p>
            <div className="flex flex-wrap gap-4 text-xs" style={{ color: "#8b8b9e" }}>
              <span><span className="text-white font-semibold">{projects.length}</span> projects</span>
              <span><span className="text-white font-semibold">{resources.length}</span> resources</span>
              {community && (
                <a
                  href={`/community/${community.id}`}
                  className="font-medium transition-colors hover:text-white"
                  style={{ color: disc.color }}
                >
                  → Join community
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e" }}>
        {tabs.map(({ id, label, icon: TabIcon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={tab === id
              ? { background: "linear-gradient(135deg, #6633ee, #7744ff)", color: "#fff" }
              : { color: "#8b8b9e" }
            }
          >
            <TabIcon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Projects ── */}
      {tab === "projects" && (
        <div>
          {/* Sub-filters */}
          <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ backgroundColor: "#1a1a28" }}>
            {filterOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setProjFilter(value)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={projFilter === value
                  ? { backgroundColor: disc.color, color: "#fff" }
                  : { color: "#8b8b9e" }
                }
              >
                {label}
              </button>
            ))}
          </div>

          {projLoading ? (
            <div className="text-center py-16">
              <p className="text-sm" style={{ color: "#8b8b9e" }}>Loading projects…</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-white font-medium mb-1">No projects here yet</p>
              <p className="text-sm" style={{ color: "#8b8b9e" }}>
                Be the first to post a {projFilter !== "all" ? projFilter : ""} project in {disc.name}.
              </p>
              <a
                href="/create"
                className="inline-block mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
              >
                Post a project
              </a>
            </div>
          )}

          {/* Opportunities section */}
          {opps.length > 0 && (
            <div className="mt-10">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase size={16} style={{ color: disc.color }} />
                Opportunities in {disc.name}
              </h2>
              <div className="flex flex-col gap-3">
                {opps.map((opp) => {
                  const days = daysUntil(opp.deadline);
                  return (
                    <div
                      key={opp.id}
                      className="rounded-2xl border p-4 flex items-center justify-between gap-4"
                      style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: disc.color + "22", color: disc.color }}>
                            {opp.category}
                          </span>
                          {days <= 30 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400">
                              {days}d left
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-white">{opp.title}</p>
                        <div className="flex items-center gap-3 text-xs" style={{ color: "#8b8b9e" }}>
                          <span className="flex items-center gap-1"><Globe size={11} />{opp.country}</span>
                          <span className="flex items-center gap-1"><Calendar size={11} />{formatDeadline(opp.deadline)}</span>
                        </div>
                      </div>
                      <a
                        href={opp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white flex-shrink-0 hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
                      >
                        Apply <ExternalLink size={11} />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Field Tools ── */}
      {tab === "tools" && (
        <div>
          {tools.length === 0 ? (
            <p className="text-center py-16 text-sm" style={{ color: "#8b8b9e" }}>No tools listed yet for this discipline.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl border p-5 transition-colors"
                  style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2e2e44")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: disc.color + "22", color: disc.color }}>
                      {tool.category}
                    </span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                      tool.free ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-500/15 text-zinc-400"
                    )}>
                      {tool.free ? "Free" : "Paid"}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-[#a78bfa] transition-colors flex items-center gap-1.5">
                    {tool.name} <ExternalLink size={11} style={{ color: "#8b8b9e" }} />
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#8b8b9e" }}>{tool.description}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Q&A ── */}
      {tab === "qa" && (
        <div className="flex flex-col gap-4">
          <div>
            {!showAskForm ? (
              <button
                onClick={() => setShowAskForm(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
              >
                Ask a question
              </button>
            ) : (
              profileCompleted ? (
                <div
                  className="rounded-2xl border p-5 flex flex-col gap-3"
                  style={{ backgroundColor: "#111118", borderColor: "#6633ee" }}
                >
                  <h3 className="text-sm font-semibold text-white">Ask a question</h3>
                  <input
                    type="text"
                    placeholder="Question title — be specific"
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e" }}
                    onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
                    onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
                  />
                  <textarea
                    rows={4}
                    placeholder="Describe the problem in detail. Include what you've tried."
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none resize-none"
                    style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e" }}
                    onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
                    onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setShowAskForm(false)} className="text-xs px-3 py-1.5 rounded-lg" style={{ color: "#8b8b9e", backgroundColor: "#1a1a28" }}>Cancel</button>
                    <button className="text-xs px-4 py-1.5 rounded-lg font-medium text-white" style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}>Post question</button>
                  </div>
                </div>
              ) : (
                <ProfileGate action="post a question" />
              )
            )}
          </div>

          {qaPosts.length === 0 ? (
            <p className="text-center py-16 text-sm" style={{ color: "#8b8b9e" }}>No questions yet. Be the first to ask!</p>
          ) : null}
        </div>
      )}

      {/* ── Research ── */}
      {tab === "research" && (
        <div className="flex flex-col gap-3">
          <p className="text-xs mb-2" style={{ color: "#8b8b9e" }}>Sorted by community votes. Most useful resources rise to the top.</p>
          {resources.length === 0 ? (
            <p className="text-center py-16 text-sm" style={{ color: "#8b8b9e" }}>No resources yet. Add the first one.</p>
          ) : (
            resources.map((res) => {
              const curVotes = resourceVotes[res.id] ?? res.votes;
              return (
                <div
                  key={res.id}
                  className="rounded-2xl border p-4 flex items-center gap-4"
                  style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
                >
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    <button
                      onClick={() => setResourceVotes((v) => ({ ...v, [res.id]: curVotes + 1 }))}
                      className="p-1 rounded transition-colors hover:text-white"
                      style={{ color: "#8b8b9e" }}
                    >
                      <ChevronUp size={16} />
                    </button>
                    <span className="text-xs font-bold" style={{ color: "#a78bfa" }}>{curVotes}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white mb-0.5">{res.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "#8b8b9e" }}>{res.description}</p>
                  </div>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white flex-shrink-0 hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
                  >
                    Open <ExternalLink size={11} />
                  </a>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
