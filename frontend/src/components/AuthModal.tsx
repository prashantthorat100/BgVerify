"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  Phone,
  ArrowRight,
  AlertCircle,
  X,
  GraduationCap,
  Briefcase,
  Shield
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
  initialRole?: "ADMIN" | "ORG_HR" | "CANDIDATE";
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  initialRole = "ORG_HR",
}: AuthModalProps) {
  const { login, register, switchDemoUser } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [selectedRole, setSelectedRole] = useState<"ADMIN" | "ORG_HR" | "CANDIDATE">(initialRole);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          full_name: fullName,
          role: selectedRole,
          organization_name: selectedRole === "ORG_HR" ? orgName : undefined,
          phone: selectedRole === "CANDIDATE" ? phone : undefined,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication request failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (role: "ADMIN" | "ORG_HR" | "CANDIDATE") => {
    setError(null);
    setIsSubmitting(true);
    try {
      await switchDemoUser(role);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to switch demo role");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xl relative text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              BGVerify<span className="text-blue-600">.ai</span>
            </h2>
            <p className="text-xs text-slate-500">
              {mode === "login" ? "Sign in to access your verification dashboard" : "Create a new user account"}
            </p>
          </div>
        </div>

        {/* Quick Demo Login Bar */}
        <div className="mb-5 bg-slate-50 border border-slate-200 p-3 rounded-xl">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Instant 1-Click Demo Login:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("ORG_HR")}
              className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold text-center transition-all"
            >
              HR Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("CANDIDATE")}
              className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold text-center transition-all"
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("ADMIN")}
              className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold text-center transition-all"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Tab switch: Sign In vs Sign Up */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === "login"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === "signup"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selection for Sign Up */}
        {mode === "signup" && (
          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Select Your Role:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole("ORG_HR")}
                className={`p-2 rounded-xl border text-left transition-all ${
                  selectedRole === "ORG_HR"
                    ? "bg-blue-50 border-blue-300 text-blue-900 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Briefcase className="w-4 h-4 mb-1 text-blue-600" />
                <div className="text-xs leading-tight">HR Team</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("CANDIDATE")}
                className={`p-2 rounded-xl border text-left transition-all ${
                  selectedRole === "CANDIDATE"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <GraduationCap className="w-4 h-4 mb-1 text-emerald-600" />
                <div className="text-xs leading-tight">Candidate</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("ADMIN")}
                className={`p-2 rounded-xl border text-left transition-all ${
                  selectedRole === "ADMIN"
                    ? "bg-slate-100 border-slate-400 text-slate-900 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Shield className="w-4 h-4 mb-1 text-slate-700" />
                <div className="text-xs leading-tight">Admin</div>
              </button>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === "signup" && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-xs"
              />
            </div>
          )}

          {mode === "signup" && selectedRole === "ORG_HR" && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Company / Organization Name</label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Acme Global Inc."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-xs"
              />
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. hr@acme-corp.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>
              {isSubmitting
                ? "Signing in..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
