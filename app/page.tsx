"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, LogIn, UserPlus, Cpu, Code2, Users, Zap,
  Plane, Settings2, Building2, FlaskConical, Bot, Heart, Layers, Leaf,
} from "lucide-react";
import { disciplines, projects, users } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

const ICON_MAP: Record<string, React.ElementType> = {
  Plane, Settings2, Zap, Building2, FlaskConical,
  Code2, Bot, Heart, Layers, Leaf,
};

const VALUE_PROPS = [
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
  {
    icon: Code2,
    title: "Discipline communities",
    desc: "Q&A, field tools, and research notes organized by your engineering discipline.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, profileCompleted, signIn, signUp } = useAuth();

  // Routing: signed-in users never see the marketing hero.
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(profileCompleted ? "/engineering" : "/onboarding");
    }
  }, [isAuthenticated, profileCompleted, router]);

  if (isAuthenticated) return null;

  function handleSignUp() {
    signUp();
    router.push("/onboarding");
  }

  function handleLogIn() {
    signIn();
    router.push("/engineering");
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        className="flex flex-col items-center justify-center px-4 py-24 text-center relative overflow-hidden"
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

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-tight relative"
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

        {/* One-sentence description */}
        <p
          className="text-lg mb-10 max-w-xl leading-relaxed relative"
          style={{ color: "#8b8b9e" }}
        >
          BuildNet is the home for engineering students who build things — showcase
          your projects, find the right teammates, and discover real opportunities,
          all in one place.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 relative">
          <button
            onClick={handleSignUp}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #6633ee, #7744ff)",
              boxShadow: "0 0 32px #6633ee66",
            }}
          >
            <UserPlus size={17} />
            Sign up
            <ArrowRight size={15} />
          </button>

          <button
            onClick={handleLogIn}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-colors hover:text-white"
            style={{
              color: "#8b8b9e",
              backgroundColor: "#111118",
              border: "1px solid #1e1e2e",
            }}
          >
            <LogIn size={15} />
            Log in
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-16 relative">
          {[
            { icon: Zap, label: "active projects", value: projects.length },
            { icon: Users, label: "builders", value: users.length },
            { icon: Cpu, label: "disciplines", value: disciplines.length },
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

      {/* Value props */}
      <section
        className="border-t py-12 px-4"
        style={{ borderColor: "#1e1e2e", backgroundColor: "#0d0d15" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-center">
          {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
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

      {/* Discipline preview — public, browsable read-only */}
      <section className="py-16 px-4" style={{ backgroundColor: "#0a0a0f" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Browse by discipline</h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: "#8b8b9e" }}>
              Ten engineering disciplines, each with their own projects, Q&amp;A, field
              tools and research. Open to explore — sign in to join in.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {disciplines.map((disc) => {
              const Icon = ICON_MAP[disc.icon] ?? Code2;
              return (
                <Link
                  key={disc.id}
                  href={`/engineering/${disc.slug}`}
                  className="group flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all"
                  style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = disc.color + "66")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: disc.color + "22" }}
                  >
                    <Icon size={18} style={{ color: disc.color }} />
                  </div>
                  <span className="text-xs font-medium text-white leading-snug">
                    {disc.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/engineering"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white"
              style={{ color: "#a78bfa" }}
            >
              See all disciplines <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-10 px-4"
        style={{ borderColor: "#1e1e2e", backgroundColor: "#0d0d15" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6633ee, #a855f7)" }}
            >
              <Cpu size={15} className="text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">BuildNet</span>
          </div>

          <div className="flex items-center gap-6 text-xs" style={{ color: "#8b8b9e" }}>
            <Link href="/engineering" className="hover:text-white transition-colors">Engineering</Link>
            <Link href="/foundry" className="hover:text-white transition-colors">Foundry</Link>
            <Link href="/about" className="hover:text-white transition-colors">About us</Link>
          </div>

          <p className="text-xs" style={{ color: "#5a5a6e" }}>
            © 2026 BuildNet. Built by engineering students, for engineering students.
          </p>
        </div>
      </footer>
    </div>
  );
}
