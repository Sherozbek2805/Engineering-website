"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

type Stage = "Idea" | "Prototype" | "Testing" | "Final";
type ProjectType = "hardware" | "software";

interface Milestone {
  id: string;
  title: string;
  done: boolean;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ProjectType>("hardware");
  const [stage, setStage] = useState<Stage>("Idea");
  const [progress, setProgress] = useState(0);
  const [tags, setTags] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "1", title: "", done: false },
  ]);

  function addMilestone() {
    setMilestones((ms) => [
      ...ms,
      { id: Date.now().toString(), title: "", done: false },
    ]);
  }

  function removeMilestone(id: string) {
    setMilestones((ms) => ms.filter((m) => m.id !== id));
  }

  function updateMilestone(id: string, title: string) {
    setMilestones((ms) => ms.map((m) => (m.id === id ? { ...m, title } : m)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => router.push("/feed"), 2000);
  }

  const inputStyle = {
    backgroundColor: "#111118",
    border: "1px solid #1e1e2e",
    color: "#ffffff",
    borderRadius: "12px",
  };

  const labelStyle = { color: "#8b8b9e", fontSize: "13px", fontWeight: 500 };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 size={48} style={{ color: "#6633ee" }} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Project created!</h2>
          <p style={{ color: "#8b8b9e" }} className="text-sm">
            Redirecting to the feed…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Create a project</h1>
        <p className="text-sm" style={{ color: "#8b8b9e" }}>
          Tell the community what you're building right now.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
            placeholder="What are you building? What problem does it solve? Where are you now?"
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
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize"
                style={
                  type === t
                    ? {
                        background: "linear-gradient(135deg, #6633ee, #7744ff)",
                        color: "#fff",
                      }
                    : {
                        backgroundColor: "#111118",
                        border: "1px solid #1e1e2e",
                        color: "#8b8b9e",
                      }
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Stage */}
        <div className="flex flex-col gap-1.5">
          <label style={labelStyle}>Stage</label>
          <div className="flex flex-wrap gap-2">
            {(["Idea", "Prototype", "Testing", "Final"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStage(s)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={
                  stage === s
                    ? {
                        background: "linear-gradient(135deg, #6633ee, #7744ff)",
                        color: "#fff",
                      }
                    : {
                        backgroundColor: "#111118",
                        border: "1px solid #1e1e2e",
                        color: "#8b8b9e",
                      }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>Progress — {progress}%</label>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full accent-violet-500 cursor-pointer"
          />
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: "#1e1e2e" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #6633ee, #a855f7)",
              }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label style={labelStyle}>Tags (comma-separated)</label>
          <input
            type="text"
            placeholder="e.g. drone, arduino, computer-vision"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="px-4 py-2.5 text-sm outline-none w-full"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
          />
        </div>

        {/* Looking for */}
        <div className="flex flex-col gap-1.5">
          <label style={labelStyle}>Looking for (comma-separated roles)</label>
          <input
            type="text"
            placeholder="e.g. Backend Developer, PCB Designer, Pilot"
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            className="px-4 py-2.5 text-sm outline-none w-full"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
          />
        </div>

        {/* Milestones */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>Milestones</label>
          {milestones.map((m) => (
            <div key={m.id} className="flex gap-2">
              <input
                type="text"
                placeholder="Milestone description"
                value={m.title}
                onChange={(e) => updateMilestone(m.id, e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm outline-none"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
                onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
              />
              {milestones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMilestone(m.id)}
                  className="p-2.5 rounded-xl transition-colors hover:text-white flex-shrink-0"
                  style={{
                    backgroundColor: "#111118",
                    border: "1px solid #1e1e2e",
                    color: "#8b8b9e",
                  }}
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMilestone}
            className="flex items-center gap-1.5 text-xs font-medium mt-1 transition-colors"
            style={{ color: "#6633ee" }}
          >
            <Plus size={14} />
            Add milestone
          </button>
        </div>

        {/* Submit */}
        <div
          className="pt-4 border-t flex justify-end"
          style={{ borderColor: "#1e1e2e" }}
        >
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #6633ee, #7744ff)",
            }}
          >
            Create project
          </button>
        </div>
      </form>
    </div>
  );
}
