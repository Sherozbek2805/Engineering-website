"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Cpu, LogIn, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const justRegistered = searchParams.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const inputStyle = {
    backgroundColor: "#0a0a0f",
    border: "1px solid #1e1e2e",
    color: "#ffffff",
    borderRadius: "12px",
  };
  const labelStyle = { color: "#8b8b9e", fontSize: "13px", fontWeight: 500 };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const user = login(email, password);
    if (!user) {
      setError("Invalid email or password.");
      return;
    }
    router.push(user.profileCompleted ? "/engineering" : "/onboarding");
  }

  function handleGoogle() {
    setError("Continue with Google is coming soon — use email + password for now.");
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ background: "linear-gradient(135deg, #6633ee, #a855f7)" }}
          >
            <Cpu size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm" style={{ color: "#8b8b9e" }}>
            Log in to keep building.
          </p>
        </div>

        {justRegistered && !error && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs mb-4"
            style={{ backgroundColor: "#0f2e22", border: "1px solid #1d4d38", color: "#34d399" }}
          >
            <CheckCircle2 size={14} className="flex-shrink-0" />
            Account created — log in to continue.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border p-6 flex flex-col gap-4"
          style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
        >
          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
              style={{ backgroundColor: "#3f1d1d", border: "1px solid #5c2424", color: "#f87171" }}
            >
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              className="px-4 py-2.5 text-sm outline-none w-full"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
              onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="px-4 py-2.5 text-sm outline-none w-full"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
              onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 mt-1"
            style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
          >
            <LogIn size={15} />
            Log in
          </button>

          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px" style={{ backgroundColor: "#1e1e2e" }} />
            <span className="text-xs" style={{ color: "#5a5a6e" }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#1e1e2e" }} />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:text-white"
            style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e", color: "#8b8b9e" }}
          >
            Continue with Google
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: "#8b8b9e" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium hover:underline" style={{ color: "#a78bfa" }}>
            Sign up
          </Link>
        </p>

        <p className="text-center text-xs mt-4" style={{ color: "#5a5a6e" }}>
          Demo account: akbar@buildnet.dev / buildnet123
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-sm mx-auto px-4 py-16"><p style={{ color: "#8b8b9e" }}>Loading…</p></div>}>
      <LoginContent />
    </Suspense>
  );
}
