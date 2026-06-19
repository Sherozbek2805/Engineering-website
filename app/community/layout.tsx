"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { communities, getDisciplineById } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import {
  Plane, Settings2, Zap, Building2, FlaskConical,
  Code2, Bot, Heart, Layers, Leaf,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Plane, Settings2, Zap, Building2, FlaskConical,
  Code2, Bot, Heart, Layers, Leaf,
};

function Pill({ label }: { label: string }) {
  return (
    <div
      className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
      style={{ backgroundColor: "#1e1e2e", color: "#e2e2f0", boxShadow: "0 4px 16px rgba(0,0,0,0.5)" }}
    >
      {label}
    </div>
  );
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser } = useAuth();

  const dmActive = pathname.startsWith("/community/dm");

  return (
    <div className="flex" style={{ height: "calc(100vh - 56px)" }}>
      {/* Left rail — community server icons */}
      <nav
        className="flex-shrink-0 flex flex-col items-center gap-2 py-3 overflow-y-auto"
        style={{ width: 72, backgroundColor: "#0d0d14", borderRight: "1px solid #1e1e2e" }}
      >
        {communities.map((c) => {
          const disc = getDisciplineById(c.disciplineId);
          const Icon = disc ? (ICON_MAP[disc.icon] ?? Code2) : Code2;
          const color = disc?.color ?? "#6633ee";
          const active = pathname.startsWith(`/community/${c.id}`);
          const isMember = currentUser?.joinedCommunityIds?.includes(c.id);

          return (
            <Link
              key={c.id}
              href={`/community/${c.id}`}
              title={c.name}
              className="group relative flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:rounded-xl"
              style={{
                backgroundColor: active ? color + "33" : "#1a1a28",
                border: active ? `2px solid ${color}` : "2px solid transparent",
                boxShadow: active ? `0 0 12px ${color}44` : undefined,
              }}
            >
              <Icon size={20} style={{ color: active ? color : isMember ? color + "cc" : "#5a5a6e" }} />
              {isMember && !active && (
                <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              )}
              <Pill label={c.name.replace(" Community", "")} />
            </Link>
          );
        })}

        {/* Separator */}
        <div className="w-8 my-1" style={{ height: 1, backgroundColor: "#1e1e2e" }} />

        {/* DMs */}
        <Link
          href="/community/dm"
          title="Direct Messages"
          className="group relative flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:rounded-xl"
          style={{
            backgroundColor: dmActive ? "#6633ee33" : "#1a1a28",
            border: dmActive ? "2px solid #6633ee" : "2px solid transparent",
          }}
        >
          <MessageSquare size={20} style={{ color: dmActive ? "#a78bfa" : "#5a5a6e" }} />
          <Pill label="Direct Messages" />
        </Link>
      </nav>

      {/* Page content */}
      <div className="flex-1 min-w-0 flex overflow-hidden">
        {children}
      </div>
    </div>
  );
}
