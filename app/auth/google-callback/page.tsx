"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cpu } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function GoogleCallbackPage() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (currentUser) {
      router.replace(currentUser.profileCompleted ? "/engineering" : "/onboarding");
    } else {
      router.replace("/login?error=OAuthCallback");
    }
  }, [currentUser, isLoading, router]);

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #6633ee, #a855f7)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          <Cpu size={24} className="text-white" />
        </div>
        <p className="text-sm" style={{ color: "#8b8b9e" }}>Signing you in with Google…</p>
      </div>
    </div>
  );
}
