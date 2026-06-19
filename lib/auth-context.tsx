"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import {
  User,
  users,
  verifyCredentials,
  registerAccount,
  loginOrCreateGoogleUser,
  connectVerification,
} from "./mock-data";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  /** True while the NextAuth session is being resolved on first load. */
  isLoading: boolean;
  profileCompleted: boolean;
  /** Email/password login. Returns the signed-in User, or null if credentials are wrong. */
  login: (email: string, password: string) => User | null;
  signup: (name: string, email: string, password: string) => { user: User } | { error: string };
  signOut: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  /** Mock: connect GitHub or LinkedIn to set verified=true on the current user. */
  verify: (provider: "github" | "linkedin") => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  profileCompleted: false,
  login: () => null,
  signup: () => ({ error: "Not ready" }),
  signOut: () => {},
  updateCurrentUser: () => {},
  verify: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { data: session, status } = useSession();

  // Bridge: when a Google session appears, sync it to the mock user system.
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email && !currentUser) {
      const user = loginOrCreateGoogleUser(
        session.user.email,
        session.user.name ?? "",
        session.user.image ?? ""
      );
      setCurrentUser(user);
    }
  }, [session, status, currentUser]);

  function login(email: string, password: string): User | null {
    const user = verifyCredentials(email, password);
    if (!user) return null;
    setCurrentUser(user);
    return user;
  }

  function signup(name: string, email: string, password: string) {
    return registerAccount(name, email, password);
  }

  function signOut() {
    setCurrentUser(null);
    nextAuthSignOut({ redirect: false }).catch(() => {});
  }

  function updateCurrentUser(updates: Partial<User>) {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      const idx = users.findIndex((u) => u.id === updated.id);
      if (idx !== -1) users[idx] = updated;
      return updated;
    });
  }

  function verify(provider: "github" | "linkedin") {
    if (!currentUser) return;
    connectVerification(currentUser.id, provider);
    updateCurrentUser({ verified: true, verificationProvider: provider });
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        isLoading: status === "loading",
        profileCompleted: currentUser?.profileCompleted ?? false,
        login,
        signup,
        signOut,
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
