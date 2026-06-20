"use client";

import Link from "next/link";
import {
  Plane, Settings2, Zap, Building2, FlaskConical,
  Code2, Bot, Heart, Layers, Leaf, ArrowRight,
} from "lucide-react";
import { disciplines } from "@/lib/mock-data";

const ICON_MAP: Record<string, React.ElementType> = {
  Plane, Settings2, Zap, Building2, FlaskConical,
  Code2, Bot, Heart, Layers, Leaf,
};

export default function EngineeringPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {disciplines.map((disc) => {
          const Icon = ICON_MAP[disc.icon] ?? Code2;

          return (
            <Link
              key={disc.id}
              href={`/engineering/${disc.slug}`}
              className="group block rounded-2xl border p-5 transition-all"
              style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = disc.color + "66")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e2e")}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: disc.color + "22" }}>
                <Icon size={22} style={{ color: disc.color }} />
              </div>
              <h2 className="text-sm font-bold text-white mb-1.5">{disc.name}</h2>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "#8b8b9e" }}>{disc.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs italic" style={{ color: "#8b8b9e" }}>Be the first</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" style={{ color: disc.color }} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
