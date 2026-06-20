"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, CheckCircle2, LogIn } from "lucide-react";
import Link from "next/link";
import { disciplines } from "@/lib/mock-data";
import { createProject } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";

type Stage = "Idea" | "Prototype" | "Testing" | "Final";
type ProjectType = "hardware" | "software";
interface Milestone { id: string; title: string; done: boolean }

export default function CreateProjectPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [disciplineId, setDisciplineId] = useState("");
  const [type, setType] = useState<ProjectType>("hardware");
  const [stage, setStage] = useState<Stage>("Idea");
  const [progress, setProgress] = useState(0);
  const [tags, setTags] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([{ id: "1", title: "", done: false }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const inputStyle = { backgroundColor: "#111118", border: "1px solid #1e1e2e", color: "#ffffff", borderRadius: "12px" };
  const labelStyle = { color: "#8b8b9e", fontSize: "13px", fontWeight: 500 };

  function addMilestone() {
    setMilestones((ms) => [...ms, { id: Date.now().toString(), title: "", done: false }]);
  }
  function removeMilestone(id: string) { setMilestones((ms) => ms.filter((m) => m.id !== id)); }
  function updateMilestone(id: string, title: string) {
    setMilestones((ms) => ms.map((m) => (m.id === id ? { ...m, title } : m)));
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <LogIn size={32} className="mx-auto mb-4" style={{ color: "#2e2e44" }} />
        <p className="text-white font-medium mb-4">Sign in to create a project</p>
        <Link href="/login" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}>
          Sign in
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: "#6633ee" }} />
          <h2 className="text-xl font-bold text-white mb-2">Project created!</h2>
          <p className="text-sm" style={{ color: "#8b8b9e" }}>Redirecting…</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser || !disciplineId) {
      setError("Please select a discipline.");
      return;
    }
    setError("");
    setLoading(true);

    const disc = disciplines.find((d) => d.id === disciplineId);
    const result = await createProject({
      title,
      description,
      disciplineId,
      kind: type,
      stage,
      progress,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      lookingFor: lookingFor.split(",").map((r) => r.trim()).filter(Boolean),
      milestones: milestones.filter((m) => m.title.trim()).map(({ title, done }) => ({ title, done })),
      ownerId: currentUser.id,
    });

    setLoading(false);
    if (result.error) { setError(result.error); return; }

    setDone(true);
    setTimeout(() => router.push(disc ? `/engineering/${disc.slug}` : "/engineering"), 1500);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Create a project</h1>
        <p className="text-sm" style={{ color: "#8b8b9e" }}>Tell the community what you&apos;re building right now.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
          <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "#3f1d1d", border: "1px solid #5c2424", color: "#f87171" }}>
            {error}
          </div>
        )}

        {/* Discipline */}
        <div className="flex flex-col gap-1.5">
          <label style={labelStyle}>Discipline *</label>
          <select
            required
            value={disciplineId}
            onChange={(e) => setDisciplineId(e.target.value)}
            className="px-4 py-2.5 text-sm outline-none w-full"
            style={inputStyle}
          >
            <option value="">Select a discipline…</option>
            {disciplines.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label style={labelStyle}>Project title *</label>
          <input
            required
            type="text"
            placeholder="e.g. AutoDrone — Autonomous Delivery System"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2.5 text-sm outline-none w-full"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label style={labelStyle}>Description *</label>
          <textarea
            required
            rows={4}
            placeholder="What are you building? What problem does it solve?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-2.5 text-sm outline-none w-full resize-none"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
          />
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1.5">
          <label style={labelStyle}>Project type</label>
          <div className="flex gap-2">
            {(["hardware", "software"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)} className="px-4 py-2 rounded-xl text-sm font-medium capitalize"
                style={type === t ? { background: "linear-gradient(135deg, #6633ee, #7744ff)", color: "#fff" } : { backgroundColor: "#111118", border: "1px solid #1e1e2e", color: "#8b8b9e" }}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* Stage */}
        <div className="flex flex-col gap-1.5">
          <label style={labelStyle}>Stage</label>
          <div className="flex flex-wrap gap-2">
            {(["Idea", "Prototype", "Testing", "Final"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setStage(s)} className="px-4 py-2 rounded-xl text-sm font-medium"
                style={stage === s ? { background: "linear-gradient(135deg, #6633ee, #7744ff)", color: "#fff" } : { backgroundColor: "#111118", border: "1px solid #1e1e2e", color: "#8b8b9e" }}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>Progress — {progress}%</label>
          <input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full accent-violet-500 cursor-pointer" />
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#1e1e2e" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #6633ee, #a855f7)" }} />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label style={labelStyle}>Tags (comma-separated)</label>
          <input type="text" placeholder="e.g. drone, arduino, computer-vision" value={tags} onChange={(e) => setTags(e.target.value)} className="px-4 py-2.5 text-sm outline-none w-full" style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#6633ee")} onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")} />
        </div>

        {/* Looking for */}
        <div className="flex flex-col gap-1.5">
          <label style={labelStyle}>Looking for (comma-separated roles)</label>
          <input type="text" placeholder="e.g. Backend Developer, PCB Designer" value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} className="px-4 py-2.5 text-sm outline-none w-full" style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#6633ee")} onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")} />
        </div>

        {/* Milestones */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>Milestones</label>
          {milestones.map((m) => (
            <div key={m.id} className="flex gap-2">
              <input type="text" placeholder="Milestone description" value={m.title} onChange={(e) => updateMilestone(m.id, e.target.value)} className="flex-1 px-4 py-2.5 text-sm outline-none" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6633ee")} onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")} />
              {milestones.length > 1 && (
                <button type="button" onClick={() => removeMilestone(m.id)} className="p-2.5 rounded-xl flex-shrink-0" style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e", color: "#8b8b9e" }}>
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addMilestone} className="flex items-center gap-1.5 text-xs font-medium mt-1" style={{ color: "#6633ee" }}>
            <Plus size={14} /> Add milestone
          </button>
        </div>

        <div className="pt-4 border-t flex justify-end" style={{ borderColor: "#1e1e2e" }}>
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}>
            {loading ? "Creating…" : "Create project"}
          </button>
        </div>
      </form>
    </div>
  );
}
