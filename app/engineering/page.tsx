"use client";

import Link from "next/link";
import {
  Plane, Settings2, Zap, Building2, FlaskConical,
  Code2, Bot, Heart, Layers, Leaf, ArrowRight,
} from "lucide-react";
import { disciplines, projects, users } from "@/lib/mock-data";

const ICON_MAP: Record<string, React.ElementType> = {
  Plane, Settings2, Zap, Building2, FlaskConical,
  Code2, Bot, Heart, Layers, Leaf,
};

export default function EngineeringPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-3">Engineering</h1>
        <p className="text-base max-w-lg mx-auto" style={{ color: "#8b8b9e" }}>
          Choose your discipline. Explore projects, tools, Q&amp;A, and research
          from the community building in that field.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {disciplines.map((disc) => {
          const Icon = ICON_MAP[disc.icon] ?? Code2;
          const discProjects = projects.filter((p) => p.disciplineId === disc.id);
          const memberSet = new Set(discProjects.flatMap((p) => p.teamMemberIds));
          const activeMembers = users.filter((u) => memberSet.has(u.id)).length;

          return (
            <Link
              key={disc.id}
              href={`/engineering/${disc.slug}`}
              className="group block rounded-2xl border p-5 transition-all"
              style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = disc.color + "66")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: disc.color + "22" }}
              >
                <Icon size={22} style={{ color: disc.color }} />
              </div>

              {/* Name */}
              <h2
                className="text-sm font-bold text-white mb-1.5 group-hover:transition-colors"
                style={{}}
              >
                {disc.name}
              </h2>

              {/* Description */}
              <p className="text-xs leading-relaxed mb-4" style={{ color: "#8b8b9e" }}>
                {disc.description}
              </p>

              {/* Stats + arrow */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-3 text-xs" style={{ color: "#8b8b9e" }}>
                  {discProjects.length > 0 && (
                    <span>
                      <span className="text-white font-semibold">{discProjects.length}</span> project{discProjects.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  {activeMembers > 0 && (
                    <span>
                      <span className="text-white font-semibold">{activeMembers}</span> builder{activeMembers !== 1 ? "s" : ""}
                    </span>
                  )}
                  {discProjects.length === 0 && (
                    <span className="italic">Be the first</span>
                  )}
                </div>
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                  style={{ color: disc.color }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
