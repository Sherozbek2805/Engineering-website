"use client";

import { Cpu, Zap, Users, Globe, Github } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-14">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "linear-gradient(135deg, #6633ee, #a855f7)" }}
        >
          <Cpu size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">About BuildNet</h1>
        <p className="text-base leading-relaxed" style={{ color: "#8b8b9e", maxWidth: "540px", margin: "0 auto" }}>
          BuildNet is a project-centric community for engineering students. The
          core question is simple: <em style={{ color: "#a78bfa" }}>"What are
          you building right now?"</em>
        </p>
      </div>

      {/* Why */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">Why we built this</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#c4c4d4" }}>
          Most social platforms for students revolve around posts, likes, and
          followers. But engineering students build things — and that work
          deserves its own home. A place where a drone project gets the same
          serious treatment as a research paper, and where a student from
          Tashkent can connect with a teammate in Almaty based on what they're
          both building.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#c4c4d4" }}>
          We started with Uzbekistan because that's where we are and what we
          know. The talent is here. The ambition is here. The platform is meant
          to surface it.
        </p>
      </section>

      {/* Principles */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-5">What we believe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: Zap,
              title: "Projects over posts",
              desc: "The feed is built around what you're making, not what you're saying. Active projects rise; empty profiles don't.",
            },
            {
              icon: Users,
              title: "Quality over quantity",
              desc: "You can't apply to a project or post in a community until your profile is complete. We protect signal.",
            },
            {
              icon: Globe,
              title: "Discipline-first organization",
              desc: "Everything — projects, tools, Q&A, resources, opportunities — is organized by engineering discipline, not chronology.",
            },
            {
              icon: Cpu,
              title: "Open by default",
              desc: "No gatekeeping by institution or grade. Build something real and you belong here.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "linear-gradient(135deg, #6633ee22, #7744ff22)" }}
              >
                <Icon size={18} style={{ color: "#a78bfa" }} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#8b8b9e" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">What's coming</h2>
        <div className="flex flex-col gap-2">
          {[
            { label: "Phase A", desc: "Discipline pages, Foundry, threaded Q&A, global search, profile gating", done: true },
            { label: "Phase B", desc: "Supabase auth + database, real accounts, persistent posts and votes", done: false },
            { label: "Phase C", desc: "Skill-overlap team matching, community events, resource curation rankings", done: false },
          ].map(({ label, desc, done }) => (
            <div
              key={label}
              className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e" }}
            >
              <div
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: done ? "#6633ee" : "#1e1e2e", border: done ? "none" : "2px solid #2e2e44" }}
              />
              <div>
                <span className="text-xs font-bold text-white">{label} — </span>
                <span className="text-xs" style={{ color: "#8b8b9e" }}>{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div
        className="rounded-2xl border p-6 text-center"
        style={{
          background: "linear-gradient(135deg, #6633ee15, #7744ff15)",
          borderColor: "#6633ee33",
        }}
      >
        <h3 className="text-base font-bold text-white mb-2">Built by engineering students</h3>
        <p className="text-sm mb-5" style={{ color: "#8b8b9e" }}>
          The code is open. Issues and contributions are welcome.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/engineering"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
          >
            Explore disciplines
          </Link>
          <a
            href="https://github.com/Sherozbek2805/Engineering-website"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:text-white"
            style={{
              color: "#8b8b9e",
              backgroundColor: "#111118",
              border: "1px solid #1e1e2e",
            }}
          >
            <Github size={15} />
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
