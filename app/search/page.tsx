"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Search, Filter, MapPin, GraduationCap } from "lucide-react";
import { disciplines } from "@/lib/mock-data";
import VerifiedAvatar from "@/components/VerifiedAvatar";
import Link from "next/link";

type ResultTab = "people" | "projects";

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [tab, setTab] = useState<ResultTab>("people");
  const [showFilters, setShowFilters] = useState(false);

  const selectStyle = {
    backgroundColor: "#111118",
    border: "1px solid #1e1e2e",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "6px 12px",
    fontSize: "12px",
    outline: "none",
  } as React.CSSProperties;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-4">Search</h1>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#8b8b9e" }} />
            <input
              type="text"
              placeholder="Search people, projects, skills..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
              style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e" }}
              onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
              onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
              autoFocus
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm transition-colors"
            style={{
              backgroundColor: showFilters ? "#6633ee22" : "#111118",
              border: "1px solid " + (showFilters ? "#6633ee" : "#1e1e2e"),
              color: showFilters ? "#a78bfa" : "#8b8b9e",
            }}
          >
            <Filter size={14} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            <select style={selectStyle}>
              <option value="">All disciplines</option>
              {disciplines.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e" }}>
        {(["people", "projects"] as const).map((val) => (
          <button
            key={val}
            onClick={() => setTab(val)}
            className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
            style={tab === val ? { background: "linear-gradient(135deg, #6633ee, #7744ff)", color: "#fff" } : { color: "#8b8b9e" }}
          >
            {val}
          </button>
        ))}
      </div>

      {/* Results — Supabase search coming in Phase B */}
      <div className="text-center py-16">
        <Search size={32} className="mx-auto mb-4" style={{ color: "#2e2e44" }} />
        <p className="text-white font-medium mb-1">
          {query ? `No ${tab} found for "${query}"` : `Search for ${tab}`}
        </p>
        <p className="text-sm" style={{ color: "#8b8b9e" }}>
          Full-text search across builders and projects is coming in Phase B (Supabase).
        </p>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-8"><p style={{ color: "#8b8b9e" }}>Loading…</p></div>}>
      <SearchContent />
    </Suspense>
  );
}
