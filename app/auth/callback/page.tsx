"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Cpu } from "lucide-react";
import { supabase } from "@/lib/supabase";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setError(error.message);
          setTimeout(() => router.push("/login?error=oauth"), 2500);
        } else {
          router.push("/engineering");
        }
      });
    } else {
      // No code — may have been redirected here after implicit sign-in
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.push("/engineering");
        } else {
          router.push("/login");
        }
      });
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center gap-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #6633ee, #a855f7)" }}
      >
        <Cpu size={20} className="text-white" />
      </div>
      {error ? (
        <p className="text-sm" style={{ color: "#f87171" }}>
          Sign-in failed: {error}. Redirecting…
        </p>
      ) : (
        <p className="text-sm" style={{ color: "#8b8b9e" }}>
          Completing sign-in…
        </p>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <p className="text-sm" style={{ color: "#8b8b9e" }}>Loading…</p>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
