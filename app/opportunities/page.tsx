"use client";

import { useState } from "react";
import { ExternalLink, Calendar, Globe, Briefcase } from "lucide-react";
import { opportunities } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Category =
  | "All"
  | "Internship"
  | "Competition"
  | "Scholarship"
  | "Research"
  | "Grant";

const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  Internship: {
    bg: "bg-sky-500/15",
    text: "text-sky-400",
    dot: "bg-sky-400",
  },
  Competition: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  Scholarship: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  Research: {
    bg: "bg-violet-500/15",
    text: "text-violet-400",
    dot: "bg-violet-400",
  },
  Grant: {
    bg: "bg-rose-500/15",
    text: "text-rose-400",
    dot: "bg-rose-400",
  },
};

function formatDeadline(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(dateStr: string) {
  const today = new Date();
  const deadline = new Date(dateStr);
  const diff = Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
}

export default function OpportunitiesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const categories: Category[] = [
    "All",
    "Internship",
    "Competition",
    "Scholarship",
    "Research",
    "Grant",
  ];

  const filtered =
    activeCategory === "All"
      ? opportunities
      : opportunities.filter((o) => o.category === activeCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Opportunities</h1>
        <p className="text-sm" style={{ color: "#8b8b9e" }}>
          Curated internships, competitions, scholarships, research positions and
          grants for engineering students.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={
              activeCategory === cat
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
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtered.map((opp) => {
          const style = CATEGORY_STYLES[opp.category];
          const days = daysUntil(opp.deadline);
          const urgent = days <= 30;

          return (
            <div
              key={opp.id}
              className="rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#2e2e44")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#1e1e2e")
              }
            >
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
                      style.bg,
                      style.text
                    )}
                  >
                    <span
                      className={cn("w-1.5 h-1.5 rounded-full", style.dot)}
                    />
                    {opp.category}
                  </span>
                  {urgent && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400">
                      Closes in {days}d
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-white leading-snug">
                  {opp.title}
                </h3>

                <div
                  className="flex flex-wrap items-center gap-3 text-xs"
                  style={{ color: "#8b8b9e" }}
                >
                  <span className="flex items-center gap-1">
                    <Globe size={12} />
                    {opp.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase size={12} />
                    {opp.field}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Deadline: {formatDeadline(opp.deadline)}
                  </span>
                </div>
              </div>

              <a
                href={opp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-80 flex-shrink-0 self-start sm:self-center"
                style={{
                  background: "linear-gradient(135deg, #6633ee, #7744ff)",
                }}
              >
                Apply
                <ExternalLink size={12} />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
