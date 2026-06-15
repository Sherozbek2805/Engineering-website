"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, ArrowRight, Cpu, Code2, Zap, Users, Globe } from "lucide-react";
import { projects, users } from "@/lib/mock-data";

export default function LandingPage() {
  const router = useRouter();
  const [activeType, setActiveType] = useState<"hardware" | "software">("hardware");

  const hardwareCount = projects.filter((p) => p.kind === "hardware").length;
  const softwareCount = projects.filter((p) => p.kind === "software").length;

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col">
      {/* Hero */}
      <section
        className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, #6633ee55 0%, #1a003388 40%, #0a0a0f 70%)",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(102,51,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(102,51,238,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Hardware / Software toggle */}
        <div
          className="relative flex items-center rounded-xl p-1 mb-12"
          style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e" }}
        >
          {(["hardware", "software"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                activeType === type
                  ? {
                      background: "linear-gradient(135deg, #6633ee, #7744ff)",
                      color: "#ffffff",
                    }
                  : { color: "#8b8b9e" }
              }
            >
              {type === "hardware" ? <Cpu size={14} /> : <Code2 size={14} />}
              {type === "hardware" ? "Hardware" : "Software"}
            </button>
          ))}
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight relative"
          style={{ maxWidth: "760px" }}
        >
          What are you{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #a78bfa, #6633ee, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            building
          </span>{" "}
          right now?
        </h1>

        <p
          className="text-lg mb-10 max-w-xl leading-relaxed relative"
          style={{ color: "#8b8b9e" }}
        >
          A home for engineering students who build things. Showcase your
          projects, find the right teammates, and discover real opportunities —
          all in one place.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 relative">
          <button
            onClick={() => router.push("/feed")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #6633ee, #7744ff)",
              boxShadow: "0 0 32px #6633ee66",
            }}
          >
            <Github size={17} />
            Sign in with GitHub
            <ArrowRight size={15} />
          </button>

          <button
            onClick={() => router.push("/feed")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-colors hover:text-white"
            style={{
              color: "#8b8b9e",
              backgroundColor: "#111118",
              border: "1px solid #1e1e2e",
            }}
          >
            Browse projects
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-16 relative">
          {[
            { icon: Zap, label: "active projects", value: projects.length },
            { icon: Users, label: "builders", value: users.length },
            { icon: Globe, label: "country", value: 1 },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Icon size={14} style={{ color: "#6633ee" }} />
                <span className="text-xl font-bold text-white">{value}</span>
              </div>
              <span className="text-xs" style={{ color: "#8b8b9e" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features strip */}
      <section
        className="border-t py-10 px-4"
        style={{ borderColor: "#1e1e2e", backgroundColor: "#0d0d15" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            {
              icon: Cpu,
              title: "Projects first",
              desc: "Everything revolves around what you're building — not posts, not followers.",
            },
            {
              icon: Users,
              title: "Find your team",
              desc: "Post the roles you need. Connect with builders who have the right skills.",
            },
            {
              icon: Zap,
              title: "Real opportunities",
              desc: "Curated internships, competitions, grants and scholarships for STEM students.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl"
              style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6633ee22, #7744ff22)" }}
              >
                <Icon size={20} style={{ color: "#a78bfa" }} />
              </div>
              <h3 className="font-semibold text-white text-sm">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#8b8b9e" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
