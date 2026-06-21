"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "./supabase";
import type { User } from "./mock-data";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profileCompleted: boolean;
  isGoogleLinked: boolean;
  login: (email: string, password: string) => Promise<{ user?: User; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  linkGoogle: () => Promise<{ error?: string }>;
  updateCurrentUser: (updates: Partial<User>) => Promise<void>;
  verify: (provider: "github" | "linkedin") => Promise<void>;
}

function rowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    name: (row.name as string) ?? "",
    email: (row.email as string) ?? "",
    school: (row.school as string) ?? "",
    country: (row.country as string) ?? "",
    region: (row.region as string) ?? "",
    major: (row.major as string) ?? "",
    bio: (row.bio as string) ?? "",
    avatarUrl: (row.avatar_url as string) ?? "",
    verified: (row.verified as boolean) ?? false,
    verificationProvider: row.verification_provider as "github" | "linkedin" | undefined,
    builderScore: (row.builder_score as number) ?? 0,
    skills: (row.skills as User["skills"]) ?? [],
    interests: (row.interests as string[]) ?? [],
    portfolio: (row.portfolio as User["portfolio"]) ?? [],
    extracurriculars: (row.extracurriculars as User["extracurriculars"]) ?? [],
    honors: (row.honors as User["honors"]) ?? [],
    githubUrl: (row.github_url as string) ?? "",
    linkedinUrl: (row.linkedin_url as string) ?? "",
    availability: (row.availability as User["availability"]) ?? "Not available",
    profileCompleted: (row.profile_completed as boolean) ?? false,
    role: (row.role as User["role"]) ?? "builder",
    projectIds: (row.project_ids as string[]) ?? [],
    joinedCommunityIds: (row.joined_community_ids as string[]) ?? [],
  };
}

async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return rowToUser(data as Record<string, unknown>);
}

async function fetchIsGoogleLinked(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.identities?.some((i) => i.provider === "google") ?? false;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  profileCompleted: false,
  isGoogleLinked: false,
  login: async () => ({ error: "Not ready" }),
  signup: async () => ({ error: "Not ready" }),
  signOut: async () => {},
  signInWithGoogle: async () => {},
  linkGoogle: async () => ({}),
  updateCurrentUser: async () => {},
  verify: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        Promise.all([
          fetchProfile(session.user.id),
          fetchIsGoogleLinked(),
        ]).then(([user, googleLinked]) => {
          setCurrentUser(user);
          setIsGoogleLinked(googleLinked);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const [user, googleLinked] = await Promise.all([
          fetchProfile(session.user.id),
          fetchIsGoogleLinked(),
        ]);
        setCurrentUser(user);
        setIsGoogleLinked(googleLinked);
      } else {
        setCurrentUser(null);
        setIsGoogleLinked(false);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function login(email: string, password: string): Promise<{ user?: User; error?: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return { error: "Your email hasn't been confirmed yet. Check your inbox or ask an admin to confirm it." };
      }
      return { error: "Invalid email or password." };
    }
    if (!data.user) return { error: "Login failed. Please try again." };
    const [user, googleLinked] = await Promise.all([
      fetchProfile(data.user.id),
      fetchIsGoogleLinked(),
    ]);
    if (user) setCurrentUser(user);
    setIsGoogleLinked(googleLinked);
    return { user: user ?? undefined };
  }

  async function signup(name: string, email: string, password: string): Promise<{ error?: string }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, name } },
    });
    if (error) {
      if (error.message.toLowerCase().includes("rate limit")) {
        return { error: "Too many signup attempts. Please wait a few minutes and try again." };
      }
      return { error: error.message };
    }
    // Supabase returns no error but empty identities when the email already exists
    if (data.user && (data.user.identities?.length ?? 0) === 0) {
      return { error: "An account with this email already exists. Please log in instead." };
    }
    return {};
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsGoogleLinked(false);
  }

  async function signInWithGoogle(): Promise<void> {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function linkGoogle(): Promise<{ error?: string }> {
    const { error } = await supabase.auth.linkIdentity({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) return { error: error.message };
    return {};
  }

  async function updateCurrentUser(updates: Partial<User>): Promise<void> {
    if (!currentUser) return;

    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.school !== undefined) dbUpdates.school = updates.school;
    if (updates.country !== undefined) dbUpdates.country = updates.country;
    if (updates.region !== undefined) dbUpdates.region = updates.region;
    if (updates.major !== undefined) dbUpdates.major = updates.major;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
    if (updates.githubUrl !== undefined) dbUpdates.github_url = updates.githubUrl;
    if (updates.linkedinUrl !== undefined) dbUpdates.linkedin_url = updates.linkedinUrl;
    if (updates.skills !== undefined) dbUpdates.skills = updates.skills;
    if (updates.interests !== undefined) dbUpdates.interests = updates.interests;
    if (updates.portfolio !== undefined) dbUpdates.portfolio = updates.portfolio;
    if (updates.extracurriculars !== undefined) dbUpdates.extracurriculars = updates.extracurriculars;
    if (updates.honors !== undefined) dbUpdates.honors = updates.honors;
    if (updates.profileCompleted !== undefined) dbUpdates.profile_completed = updates.profileCompleted;
    if (updates.verified !== undefined) dbUpdates.verified = updates.verified;
    if (updates.verificationProvider !== undefined) dbUpdates.verification_provider = updates.verificationProvider;

    // Auto-verify when a social URL is being saved
    const nextGithub = updates.githubUrl !== undefined ? updates.githubUrl : currentUser.githubUrl;
    const nextLinkedin = updates.linkedinUrl !== undefined ? updates.linkedinUrl : currentUser.linkedinUrl;
    if ((nextGithub?.trim() || nextLinkedin?.trim()) && !currentUser.verified) {
      dbUpdates.verified = true;
      dbUpdates.verification_provider = nextGithub?.trim() ? "github" : "linkedin";
    }
    if (updates.availability !== undefined) dbUpdates.availability = updates.availability;
    if (updates.projectIds !== undefined) dbUpdates.project_ids = updates.projectIds;
    if (updates.joinedCommunityIds !== undefined) dbUpdates.joined_community_ids = updates.joinedCommunityIds;

    await supabase.from("profiles").update(dbUpdates).eq("id", currentUser.id);
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
  }

  async function verify(provider: "github" | "linkedin"): Promise<void> {
    await updateCurrentUser({ verified: true, verificationProvider: provider });
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        isLoading,
        profileCompleted: currentUser?.profileCompleted ?? false,
        isGoogleLinked,
        login,
        signup,
        signOut,
        signInWithGoogle,
        linkGoogle,
        updateCurrentUser,
        verify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
