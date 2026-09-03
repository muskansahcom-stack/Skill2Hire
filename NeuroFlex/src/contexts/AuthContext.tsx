"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  streakDays: number;
  topicsMastered: number;
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
    confirmPassword?: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoStudent: () => void;
  logout: () => Promise<void>;
}

const DEMO_STUDENT: AuthUser = {
  id: "user-demo-default",
  name: "Muskan",
  email: "student@neuroflex.edu",
  avatarUrl: null,
  streakDays: 5,
  topicsMastered: 12,
  createdAt: "2026-08-01",
};

const STORAGE_KEY = "neuroflex_auth_user";
const COOKIE_NAME = "neuroflex_session";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setSessionCookie(userId: string) {
  if (typeof document !== "undefined") {
    document.cookie = `${COOKIE_NAME}=${userId}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }
}

function clearSessionCookie() {
  if (typeof document !== "undefined") {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user session from localStorage and cookie on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setSessionCookie(parsed.id);
      } else {
        // Default to demo student
        setUser(DEMO_STUDENT);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_STUDENT));
        setSessionCookie(DEMO_STUDENT.id);
      }
    } catch (e) {
      console.warn("[AuthContext] Error loading user session:", e);
      setUser(DEMO_STUDENT);
      setSessionCookie(DEMO_STUDENT.id);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || data.details || "Invalid credentials." };
      }

      const loggedUser: AuthUser = data.user;
      setUser(loggedUser);
      setSessionCookie(loggedUser.id);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
      }
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: "Network error during login. Please try again." };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    confirmPassword?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth?action=signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword: confirmPassword || password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || data.details || "Registration failed." };
      }

      const newUser: AuthUser = data.user;
      setUser(newUser);
      setSessionCookie(newUser.id);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      }
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: "Network error during signup. Please try again." };
    }
  };

  const loginAsDemoStudent = () => {
    setUser(DEMO_STUDENT);
    setSessionCookie(DEMO_STUDENT.id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_STUDENT));
    }
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await fetch("/api/auth?action=logout", { method: "POST" });
    } catch (e) {
      console.warn("Logout request failed:", e);
    }
    setUser(null);
    clearSessionCookie();
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginAsDemoStudent,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
