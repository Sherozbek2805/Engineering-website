"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User, users, MOCK_CURRENT_USER_ID, createGuestUser } from "./mock-data";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  profileCompleted: boolean;
  signIn: () => void;
  signUp: () => void;
  signOut: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  profileCompleted: false,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
  updateCurrentUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // "Log in" — mock returning-user flow, signs in as the seeded demo account.
  function signIn() {
    setCurrentUser(users.find((u) => u.id === MOCK_CURRENT_USER_ID) ?? null);
  }

  // "Sign up" — mock new-user flow, creates a fresh empty profile that needs onboarding.
  function signUp() {
    const guest = createGuestUser();
    users.push(guest);
    setCurrentUser(guest);
  }

  function signOut() {
    setCurrentUser(null);
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

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        profileCompleted: currentUser?.profileCompleted ?? false,
        signIn,
        signUp,
        signOut,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
