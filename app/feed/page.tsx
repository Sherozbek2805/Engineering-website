"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { projects } from "@/lib/mock-data";
import ProjectCard from "@/components/ProjectCard";

type TypeFilter = "all" | "hardware" | "software";
type StageFilter = "all" | "Idea" | "Prototype" | "Testing" | "Final";

export default function FeedPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");

  const filtered = projects.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    const matchesStage = stageFilter === "all" || p.stage === stageFilter;
    return matchesSearch && matchesType && matchesStage;
  });

  const typeOptions: { label: string; value: TypeFilter }[] = [
    { label: "All", value: "all" },
    { label: "Hardware", value: "hardware" },
    { label: "Software", value: "software" },
  ];

  const stageOptions: { label: string; value: StageFilter }[] = [
    { label: "All stages", value: "all" },
    { label: "Idea", value: "Idea" },
    { label: "Prototype", value: "Prototype" },
    { label: "Testing", value: "Testing" },
    { label: "Final", value: "Final" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Projects</h1>
        <p style={{ color: "#8b8b9e" }} className="text-sm">
          {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#8b8b9e" }}
          />
          <input
            type="text"
            placeholder="Search projects or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white outline-none transition-colors"
            style={{
              backgroundColor: "#111118",
              border: "1px solid #1e1e2e",
              color: "#ffffff",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
          />
        </div>

        {/* Type filter */}
        <div
          className="flex items-center rounded-xl p-1 gap-0.5"
          style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e" }}
        >
          {typeOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={
                typeFilter === value
                  ? {
                      background: "linear-gradient(135deg, #6633ee, #7744ff)",
                      color: "#fff",
                    }
                  : { color: "#8b8b9e" }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stage filter */}
        <div
          className="flex items-center rounded-xl p-1 gap-0.5"
          style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e" }}
        >
          <SlidersHorizontal size={13} style={{ color: "#8b8b9e", marginLeft: "6px" }} />
          {stageOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setStageFilter(value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={
                stageFilter === value
                  ? {
                      background: "linear-gradient(135deg, #6633ee, #7744ff)",
                      color: "#fff",
                    }
                  : { color: "#8b8b9e" }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="text-white font-medium mb-1">No projects found</p>
          <p className="text-sm" style={{ color: "#8b8b9e" }}>
            Try adjusting your filters or search term
          </p>
        </div>
      )}
    </div>
  );
}
