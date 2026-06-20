"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera, Plus, X, Github, Linkedin, ArrowRight, CheckCircle2,
} from "lucide-react";
import { disciplines, Skill, PortfolioItem } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import VerifiedAvatar from "@/components/VerifiedAvatar";

const REQUIRED_WEIGHT = 70;
const OPTIONAL_WEIGHT = 30;

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated, updateCurrentUser } = useAuth();

  // Redirect anyone who lands here without being signed in.
  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  // ── Form state, prefilled from whatever the user already has ───────────────
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl ?? "");
  const [name, setName] = useState(currentUser?.name ?? "");
  const [school, setSchool] = useState(currentUser?.school ?? "");
  const [country, setCountry] = useState(currentUser?.country ?? "");
  const [region, setRegion] = useState(currentUser?.region ?? "");
  const [major, setMajor] = useState(currentUser?.major ?? "");
  const [bio, setBio] = useState(currentUser?.bio ?? "");
  const [githubUrl, setGithubUrl] = useState(currentUser?.githubUrl ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser?.linkedinUrl ?? "");

  const [skills, setSkills] = useState<Skill[]>(currentUser?.skills ?? []);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillRating, setNewSkillRating] = useState(5);

  const [interests, setInterests] = useState<string[]>(currentUser?.interests ?? []);
  const [newInterest, setNewInterest] = useState("");

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(currentUser?.portfolio ?? []);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState("");
  const [newPortfolioUrl, setNewPortfolioUrl] = useState("");

  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function addSkill() {
    if (!newSkillName.trim()) return;
    setSkills((s) => [...s, { name: newSkillName.trim(), rating: newSkillRating }]);
    setNewSkillName("");
    setNewSkillRating(5);
  }

  function removeSkill(name: string) {
    setSkills((s) => s.filter((sk) => sk.name !== name));
  }

  function addInterest() {
    const value = newInterest.trim();
    if (!value || interests.includes(value)) return;
    setInterests((i) => [...i, value]);
    setNewInterest("");
  }

  function removeInterest(value: string) {
    setInterests((i) => i.filter((x) => x !== value));
  }

  function addPortfolioItem() {
    if (!newPortfolioTitle.trim() || !newPortfolioUrl.trim()) return;
    setPortfolio((p) => [...p, { title: newPortfolioTitle.trim(), url: newPortfolioUrl.trim() }]);
    setNewPortfolioTitle("");
    setNewPortfolioUrl("");
  }

  function removePortfolioItem(title: string) {
    setPortfolio((p) => p.filter((item) => item.title !== title));
  }

  // ── Required fields (must match the gating rule used by ProfileGate) ──────
  const requiredChecks = {
    name: name.trim().length > 0,
    school: school.trim().length > 0,
    country: country.trim().length > 0,
    major: major.trim().length > 0,
    skills: skills.length > 0,
  };
  const requiredDone = Object.values(requiredChecks).filter(Boolean).length;
  const requiredTotal = Object.keys(requiredChecks).length;
  const isComplete = requiredDone === requiredTotal;

  const optionalChecks = {
    photo: avatarUrl.length > 0,
    region: region.trim().length > 0,
    bio: bio.trim().length > 0,
    interests: interests.length > 0,
    portfolio: portfolio.length > 0,
    social: githubUrl.trim().length > 0 || linkedinUrl.trim().length > 0,
  };
  const optionalDone = Object.values(optionalChecks).filter(Boolean).length;
  const optionalTotal = Object.keys(optionalChecks).length;

  const completionPercent = useMemo(() => {
    const req = (requiredDone / requiredTotal) * REQUIRED_WEIGHT;
    const opt = (optionalDone / optionalTotal) * OPTIONAL_WEIGHT;
    return Math.round(req + opt);
  }, [requiredDone, requiredTotal, optionalDone, optionalTotal]);

  async function persist(navigateOnward: boolean) {
    await updateCurrentUser({
      name: name.trim(),
      school: school.trim(),
      country: country.trim(),
      region: region.trim(),
      major: major.trim(),
      bio: bio.trim(),
      avatarUrl,
      githubUrl: githubUrl.trim(),
      linkedinUrl: linkedinUrl.trim(),
      skills,
      interests,
      portfolio,
      profileCompleted: isComplete,
    });
    if (navigateOnward) {
      if (isComplete) {
        setSaved(true);
        setTimeout(() => router.push("/engineering"), 600);
      } else {
        router.push("/engineering");
      }
    }
  }

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Build your profile</h1>
        <p className="text-sm max-w-md mx-auto" style={{ color: "#8b8b9e" }}>
          Think of this as the Common App for builders — tell us what you're
          studying and what you've made, and we'll connect you to the right
          teams and opportunities.
        </p>
      </div>

      {/* Completion meter */}
      <div
        className="rounded-2xl border p-4 mb-6 flex items-center gap-4"
        style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-white">Profile completion</span>
            <span className="text-xs font-semibold" style={{ color: "#a78bfa" }}>{completionPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#1e1e2e" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${completionPercent}%`, background: "linear-gradient(90deg, #6633ee, #a855f7)" }}
            />
          </div>
        </div>
        {isComplete && (
          <span className="flex items-center gap-1 text-xs font-medium flex-shrink-0" style={{ color: "#34d399" }}>
            <CheckCircle2 size={14} /> Ready
          </span>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {/* Photo */}
        <div
          className="rounded-2xl border p-5 flex items-center gap-4"
          style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative group flex-shrink-0"
          >
            <VerifiedAvatar name={name || "?"} avatarUrl={avatarUrl} size="lg" />
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <Camera size={16} className="text-white" />
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <div>
            <p className="text-sm font-medium text-white mb-0.5">Profile photo</p>
            <p className="text-xs" style={{ color: "#8b8b9e" }}>
              Optional — without one, we'll show a colored initial avatar instead.
            </p>
          </div>
        </div>

        {/* Identity */}
        <div
          className="rounded-2xl border p-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
          style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
        >
          <Field label="Name" required value={name} onChange={setName} placeholder="Your full name" />
          <Field label="School" required value={school} onChange={setSchool} placeholder="University / Institute" />
          <Field label="Country" required value={country} onChange={setCountry} placeholder="e.g. Uzbekistan" />
          <Field label="Region" value={region} onChange={setRegion} placeholder="e.g. Tashkent" />
          <div className="sm:col-span-2">
            <label className="text-xs font-medium block mb-1.5" style={{ color: "#8b8b9e" }}>
              Main discipline <span style={{ color: "#f87171" }}>*</span>
            </label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl outline-none text-white"
              style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e" }}
            >
              <option value="">Select a discipline…</option>
              {disciplines.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bio */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "#8b8b9e" }}>Short bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="What do you build, and what are you looking for?"
            className="w-full px-3 py-2.5 text-sm rounded-xl outline-none resize-none text-white"
            style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e" }}
          />
        </div>

        {/* Skills */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
          <label className="text-xs font-medium block mb-3" style={{ color: "#8b8b9e" }}>
            Skills <span style={{ color: "#f87171" }}>*</span> — rate yourself 1–10
          </label>

          {skills.length > 0 && (
            <div className="flex flex-col gap-2 mb-3">
              {skills.map((skill) => (
                <div key={skill.name} className="flex items-center gap-3">
                  <span className="text-sm text-white flex-1">{skill.name}</span>
                  <span className="text-xs font-semibold" style={{ color: "#a78bfa" }}>{skill.rating}/10</span>
                  <button onClick={() => removeSkill(skill.name)} style={{ color: "#8b8b9e" }} className="hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. CAD / SolidWorks"
              className="flex-1 px-3 py-2 text-sm rounded-lg outline-none text-white"
              style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e" }}
            />
            <input
              type="number"
              min={1}
              max={10}
              value={newSkillRating}
              onChange={(e) => setNewSkillRating(Math.min(10, Math.max(1, Number(e.target.value))))}
              className="w-16 px-2 py-2 text-sm rounded-lg outline-none text-white text-center"
              style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e" }}
            />
            <button
              type="button"
              onClick={addSkill}
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: "#6633ee22", color: "#a78bfa" }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Interests */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
          <label className="text-xs font-medium block mb-3" style={{ color: "#8b8b9e" }}>Interests</label>

          {interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "#1a1a28", color: "#c4c4d4" }}
                >
                  {interest}
                  <button onClick={() => removeInterest(interest)} className="hover:text-white" style={{ color: "#8b8b9e" }}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInterest(); } }}
              placeholder="e.g. Robotics — press Enter to add"
              className="flex-1 px-3 py-2 text-sm rounded-lg outline-none text-white"
              style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e" }}
            />
            <button
              type="button"
              onClick={addInterest}
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: "#6633ee22", color: "#a78bfa" }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Portfolio */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
          <label className="text-xs font-medium block mb-3" style={{ color: "#8b8b9e" }}>Portfolio</label>

          {portfolio.length > 0 && (
            <div className="flex flex-col gap-2 mb-3">
              {portfolio.map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <span className="text-sm text-white flex-1 truncate">{item.title}</span>
                  <span className="text-xs truncate max-w-[140px]" style={{ color: "#8b8b9e" }}>{item.url}</span>
                  <button onClick={() => removePortfolioItem(item.title)} style={{ color: "#8b8b9e" }} className="hover:text-white transition-colors flex-shrink-0">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newPortfolioTitle}
              onChange={(e) => setNewPortfolioTitle(e.target.value)}
              placeholder="Title"
              className="flex-1 px-3 py-2 text-sm rounded-lg outline-none text-white"
              style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e" }}
            />
            <input
              type="text"
              value={newPortfolioUrl}
              onChange={(e) => setNewPortfolioUrl(e.target.value)}
              placeholder="https://…"
              className="flex-1 px-3 py-2 text-sm rounded-lg outline-none text-white"
              style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e" }}
            />
            <button
              type="button"
              onClick={addPortfolioItem}
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: "#6633ee22", color: "#a78bfa" }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Social links */}
        <div
          className="rounded-2xl border p-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
          style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
        >
          <div>
            <label className="text-xs font-medium flex items-center gap-1.5 mb-1.5" style={{ color: "#8b8b9e" }}>
              <Github size={13} /> GitHub <span className="opacity-60">(optional)</span>
            </label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="w-full px-3 py-2.5 text-sm rounded-xl outline-none text-white"
              style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium flex items-center gap-1.5 mb-1.5" style={{ color: "#8b8b9e" }}>
              <Linkedin size={13} /> LinkedIn <span className="opacity-60">(optional)</span>
            </label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-2.5 text-sm rounded-xl outline-none text-white"
              style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e" }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => persist(true)}
            className="text-sm font-medium px-4 py-2.5 rounded-xl transition-colors hover:text-white"
            style={{ color: "#8b8b9e" }}
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={() => persist(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
          >
            Save &amp; continue <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Toast */}
      {saved && (
        <div
          className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white shadow-2xl z-50"
          style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
        >
          <CheckCircle2 size={16} /> Profile complete! Taking you to Engineering…
        </div>
      )}
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5" style={{ color: "#8b8b9e" }}>
        {label} {required && <span style={{ color: "#f87171" }}>*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm rounded-xl outline-none text-white"
        style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e" }}
      />
    </div>
  );
}
