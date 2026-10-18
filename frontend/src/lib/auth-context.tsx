"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserSession } from "./types";
import { authApi } from "./api";

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role: "ADMIN" | "ORG_HR" | "CANDIDATE";
  organization_name?: string;
  phone?: string;
}

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<UserSession>;
  register: (data: RegisterData) => Promise<UserSession>;
  logout: () => void;
  switchDemoUser: (role: "ADMIN" | "ORG_HR" | "CANDIDATE") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_ACCOUNTS = {
  ADMIN: { email: "admin@bgverify.ai", pass: "AdminPass123!" },
  ORG_HR: { email: "hr@acme-corp.com", pass: "HrPass123!" },
  CANDIDATE: { email: "candidate@example.com", pass: "CandidatePass123!" },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("bgverify_token");
    if (savedToken) {
      setToken(savedToken);
      authApi
        .getProfile(savedToken)
        .then((profile) => setUser(profile))
        .catch(() => {
          localStorage.removeItem("bgverify_token");
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const session = await authApi.login(email, pass);
      localStorage.setItem("bgverify_token", session.access_token);
      setToken(session.access_token);
      setUser(session);
      return session;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      const session = response.token;
      localStorage.setItem("bgverify_token", session.access_token);
      setToken(session.access_token);
      setUser(session);
      return session;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("bgverify_token");
    setToken(null);
    setUser(null);
  };

  const switchDemoUser = async (role: "ADMIN" | "ORG_HR" | "CANDIDATE") => {
    const creds = DEMO_ACCOUNTS[role];
    await login(creds.email, creds.pass);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, switchDemoUser }}>
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
