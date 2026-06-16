"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User, users, verifyCredentials, registerAccount } from "./mock-data";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  profileCompleted: boolean;
  /** Mock/local login — returns the signed-in user, or null if the credentials don't match. */
  login: (email: string, password: string) => User | null;
  /** Mock/local signup — does NOT sign the user in; they're redirected to /login afterward. */
  signup: (name: string, email: string, password: string) => { user: User } | { error: string };
  signOut: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  profileCompleted: false,
  login: () => null,
  signup: () => ({ error: "Not ready" }),
  signOut: () => {},
  updateCurrentUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  function login(email: string, password: string): User | null {
    const user = verifyCredentials(email, password);
    if (user) setCurrentUser(user);
    return user;
  }

  function signup(name: string, email: string, password: string) {
    return registerAccount(name, email, password);
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
        login,
        signup,
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
