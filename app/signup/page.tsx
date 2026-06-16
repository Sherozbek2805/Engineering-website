"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cpu, UserPlus, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (!name.trim()) return setError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords don't match.");

    const result = signup(name, email, password);
    if ("error" in result) {
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="px-4 py-2.5 text-sm outline-none w-full"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
              onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={labelStyle}>Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
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
            <UserPlus size={15} />
            Sign up
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
