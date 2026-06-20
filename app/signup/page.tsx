"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cpu, UserPlus, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function getStrength(pwd: string): { score: number; label: string; color: string; hint: string } {
  if (!pwd) return { score: 0, label: "", color: "", hint: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score, label: "Weak", color: "#f87171", hint: "Add uppercase letters, numbers, or symbols" };
  if (score <= 3) return { score, label: "Fair", color: "#fb923c", hint: "Try making it longer or adding symbols" };
  return { score, label: "Strong", color: "#34d399", hint: "Great password!" };
}

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getStrength(password);

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

    if (!name.trim()) return setError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords don't match.");

    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/login?registered=1");
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
          <h1 className="text-xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-sm" style={{ color: "#8b8b9e" }}>
            Join BuildNet and start building with other engineering students.
          </p>
        </div>

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
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="px-4 py-2.5 text-sm outline-none w-full"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
              onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
            />
          </div>

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
                placeholder="At least 6 characters"
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

            {password && (
              <div className="flex flex-col gap-1.5 mt-0.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-200"
                      style={{ backgroundColor: i <= strength.score ? strength.color : "#1e1e2e" }}
                    />
                  ))}
                </div>
                <p className="text-xs flex items-center gap-1.5">
                  <span style={{ color: strength.color }} className="font-medium">{strength.label}</span>
                  <span style={{ color: "#5a5a6e" }}>— {strength.hint}</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={labelStyle}>Confirm password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="px-4 py-2.5 pr-10 text-sm outline-none w-full"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
                onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#5a5a6e" }}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {confirmPassword && (
              <p className="text-xs mt-0.5" style={{ color: confirmPassword === password ? "#34d399" : "#f87171" }}>
                {confirmPassword === password ? "Passwords match" : "Passwords don't match yet"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 mt-1 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
          >
            <UserPlus size={15} />
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: "#8b8b9e" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-medium hover:underline" style={{ color: "#a78bfa" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
