"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User, users, MOCK_CURRENT_USER_ID } from "./mock-data";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  profileCompleted: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  profileCompleted: false,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(
    users.find((u) => u.id === MOCK_CURRENT_USER_ID) ?? null
  );

  function signIn() {
    setCurrentUser(users.find((u) => u.id === MOCK_CURRENT_USER_ID) ?? null);
  }

  function signOut() {
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        profileCompleted: currentUser?.profileCompleted ?? false,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
