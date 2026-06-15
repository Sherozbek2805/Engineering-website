"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Search, MapPin, GraduationCap, Filter } from "lucide-react";
import { users, projects, disciplines } from "@/lib/mock-data";
import VerifiedAvatar from "@/components/VerifiedAvatar";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";

type ResultTab = "people" | "projects";

const regions = [...new Set(users.map((u) => u.region))];
const countries = [...new Set(users.map((u) => u.country))];
const allSkills = [...new Set(users.flatMap((u) => u.skills.map((s) => s.name)))];

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [tab, setTab] = useState<ResultTab>("people");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = query.toLowerCase();
      const matchesQ = q === "" || u.name.toLowerCase().includes(q) || u.major.toLowerCase().includes(q) || u.skills.some((s) => s.name.toLowerCase().includes(q));
      const matchesCountry = filterCountry === "" || u.country === filterCountry;
      const matchesRegion = filterRegion === "" || u.region === filterRegion;
      const matchesSkill = filterSkill === "" || u.skills.some((s) => s.name === filterSkill);
      return matchesQ && matchesCountry && matchesRegion && matchesSkill;
    });
  }, [query, filterCountry, filterRegion, filterSkill]);

  const filteredProjects = useMemo(() => {
    const q = query.toLowerCase();
    return projects.filter((p) => q === "" || p.title.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)));
  }, [query]);

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

        {/* Search input */}
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

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            <select style={selectStyle} value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}>
              <option value="">All countries</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select style={selectStyle} value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
              <option value="">All regions</option>
              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select style={selectStyle} value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)}>
              <option value="">All skills</option>
              {allSkills.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {(filterCountry || filterRegion || filterSkill) && (
              <button onClick={() => { setFilterCountry(""); setFilterRegion(""); setFilterSkill(""); }} className="text-xs px-3 py-1.5 rounded-xl transition-colors hover:text-white" style={{ color: "#8b8b9e", backgroundColor: "#1a1a28" }}>
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e" }}>
        {([["people", `People (${filteredUsers.length})`], ["projects", `Projects (${filteredProjects.length})`]] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setTab(val)}
            className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={tab === val ? { background: "linear-gradient(135deg, #6633ee, #7744ff)", color: "#fff" } : { color: "#8b8b9e" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Results */}
      {tab === "people" && (
        <div className="flex flex-col gap-3">
          {filteredUsers.length === 0 ? (
            <p className="text-center py-16 text-sm" style={{ color: "#8b8b9e" }}>No people found</p>
          ) : (
            filteredUsers.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl border transition-colors"
                style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2e2e44")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
              >
                <VerifiedAvatar name={user.name} verified={user.verified} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white">{user.name}</span>
                    {user.verified && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#6633ee22", color: "#a78bfa" }}>✓</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "#8b8b9e" }}>
                    <span className="flex items-center gap-1"><GraduationCap size={11} />{user.major}</span>
                    <span className="flex items-center gap-1"><MapPin size={11} />{user.region}, {user.country}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
                  {user.skills.slice(0, 3).map((s) => (
                    <span key={s.name} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1a1a28", color: "#8b8b9e" }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {tab === "projects" && (
        filteredProjects.length === 0 ? (
          <p className="text-center py-16 text-sm" style={{ color: "#8b8b9e" }}>No projects found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )
      )}
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
