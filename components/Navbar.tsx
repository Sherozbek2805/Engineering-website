"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, LayoutGrid, Briefcase, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Projects", href: "/feed", icon: LayoutGrid },
  { label: "Opportunities", href: "/opportunities", icon: Briefcase },
  { label: "Profile", href: "/profile/u1", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "rgba(10, 10, 15, 0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "#1e1e2e",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-white hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6633ee, #a855f7)" }}
          >
            <Cpu size={15} className="text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">BuildNet</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "text-white bg-[#1a1a28]"
                    : "text-[#8b8b9e] hover:text-white hover:bg-[#1a1a28]"
                )}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          href="/create"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Post project</span>
        </Link>
      </div>
    </nav>
  );
}
