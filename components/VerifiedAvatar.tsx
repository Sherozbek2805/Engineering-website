"use client";

import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "#6633ee",
  "#2563eb",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string) {
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

interface VerifiedAvatarProps {
  name: string;
  verified?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: { outer: "w-8 h-8", text: "text-xs", ring: "p-0.5" },
  md: { outer: "w-10 h-10", text: "text-sm", ring: "p-0.5" },
  lg: { outer: "w-14 h-14", text: "text-base", ring: "p-[3px]" },
  xl: { outer: "w-20 h-20", text: "text-xl", ring: "p-1" },
};

export default function VerifiedAvatar({
  name,
  verified = false,
  size = "md",
  className,
}: VerifiedAvatarProps) {
  const { outer, text, ring } = sizeMap[size];
  const initials = getInitials(name);
  const color = getAvatarColor(name);

  const inner = (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white select-none w-full h-full",
        text
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );

  if (verified) {
    return (
      <div
        className={cn("rounded-full flex-shrink-0", outer, ring, className)}
        style={{
          background:
            "linear-gradient(135deg, #6633ee, #a855f7, #3b82f6)",
          padding: size === "xl" ? "3px" : size === "lg" ? "2.5px" : "2px",
        }}
      >
        <div className="rounded-full w-full h-full overflow-hidden">
          {inner}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex-shrink-0 overflow-hidden border-2 border-[#1e1e2e]",
        outer,
        className
      )}
    >
      {inner}
    </div>
  );
}
