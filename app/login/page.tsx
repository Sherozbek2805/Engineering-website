"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Cpu, LogIn, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signInWithGoogle } = useAuth();
  const justRegistered = searchParams.get("registered") === "1";
  const oauthError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(
    oauthError ? "Google sign-in failed. Please try again or use email/password." : ""
  );
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const inputStyle = {
    backgroundColor: "#0a0a0f",
    border: "1px solid #1e1e2e",
    color: "#ffffff",
    borderRadius: "12px",
  };
  const labelStyle = { color: "#8b8b9e", fontSize: "13px", fontWeight: 500 as const };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.error || !result.user) {
      setError(result.error ?? "Invalid email or password.");
      return;
    }
    router.push(result.user.profileCompleted ? "/engineering" : "/onboarding");
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    await signInWithGoogle();
    // Page will redirect; no need to reset state
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="px-4 py-2.5 pr-10 text-sm outline-none w-full"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
                onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#5a5a6e" }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 mt-1 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
          >
            <LogIn size={15} />
            {loading ? "Logging in…" : "Log in"}
          </button>

          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px" style={{ backgroundColor: "#1e1e2e" }} />
            <span className="text-xs" style={{ color: "#5a5a6e" }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#1e1e2e" }} />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:text-white disabled:opacity-60"
            style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e", color: "#c4c4d4" }}
          >
            <GoogleIcon />
            {googleLoading ? "Redirecting to Google…" : "Continue with Google"}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: "#8b8b9e" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium hover:underline" style={{ color: "#a78bfa" }}>
            Sign up
          </Link>
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
