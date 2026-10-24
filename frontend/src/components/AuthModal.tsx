"use client";

<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useAuth, DEMO_ACCOUNTS } from "@/lib/auth-context";
=======
import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
<<<<<<< HEAD
  Building2,
=======
  Building,
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
  Phone,
  ArrowRight,
  AlertCircle,
  X,
  GraduationCap,
  Briefcase,
<<<<<<< HEAD
  CheckCircle2,
  Sparkles
=======
  Shield
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
<<<<<<< HEAD
  initialPortal?: "CANDIDATE" | "ORG_HR";
  initialMode?: "login" | "signup";
=======
  initialMode?: "login" | "signup";
  initialRole?: "ADMIN" | "ORG_HR" | "CANDIDATE";
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
}

export function AuthModal({
  isOpen,
  onClose,
<<<<<<< HEAD
  initialPortal = "ORG_HR",
  initialMode = "login",
}: AuthModalProps) {
  const { login, register, switchDemoUser } = useAuth();
  const [portal, setPortal] = useState<"CANDIDATE" | "ORG_HR">(initialPortal);
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
=======
  initialMode = "login",
  initialRole = "ORG_HR",
}: AuthModalProps) {
  const { login, register, switchDemoUser } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [selectedRole, setSelectedRole] = useState<"ADMIN" | "ORG_HR" | "CANDIDATE">(initialRole);
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

<<<<<<< HEAD
  // Sync state when props change
  useEffect(() => {
    if (isOpen) {
      setPortal(initialPortal);
      setMode(initialMode);
      setError(null);
    }
  }, [isOpen, initialPortal, initialMode]);

=======
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
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
<<<<<<< HEAD
          role: portal,
          organization_name: portal === "ORG_HR" ? orgName : undefined,
          phone: portal === "CANDIDATE" ? phone : undefined,
=======
          role: selectedRole,
          organization_name: selectedRole === "ORG_HR" ? orgName : undefined,
          phone: selectedRole === "CANDIDATE" ? phone : undefined,
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
        });
      }
      onClose();
    } catch (err: any) {
<<<<<<< HEAD
      setError(err.message || "Authentication request failed. Please check your credentials.");
=======
      setError(err.message || "Authentication request failed");
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
    } finally {
      setIsSubmitting(false);
    }
  };

<<<<<<< HEAD
  const handleQuickDemo = async (role: "ORG_HR" | "CANDIDATE") => {
=======
  const handleQuickDemo = async (role: "ADMIN" | "ORG_HR" | "CANDIDATE") => {
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
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

<<<<<<< HEAD
  const isCandidate = portal === "CANDIDATE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl relative text-slate-900 overflow-hidden">
        {/* Top Accent Gradient Bar */}
        <div
          className={`h-2 w-full transition-colors duration-300 ${
            isCandidate
              ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"
              : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"
          }`}
        />

        <div className="p-6 sm:p-7">
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close Modal"
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-md transition-colors ${
                isCandidate ? "bg-emerald-600 shadow-emerald-500/20" : "bg-blue-600 shadow-blue-500/20"
              }`}
            >
              {isCandidate ? <GraduationCap className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  BGVerify<span className={isCandidate ? "text-emerald-600" : "text-blue-600"}>.ai</span>
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isCandidate ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {isCandidate ? "Candidate Portal" : "HR Enterprise Portal"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isCandidate
                  ? "Track your verification status & securely submit credentials"
                  : "Initiate & review autonomous background verification requests"}
              </p>
            </div>
          </div>

          {/* Portal Switcher Tabs (Candidate vs HR only - No Admin) */}
          <div className="grid grid-cols-2 gap-2 mb-4 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setPortal("CANDIDATE");
                setError(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isCandidate
                  ? "bg-white text-emerald-800 shadow-sm border border-emerald-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${isCandidate ? "text-emerald-600" : "text-slate-400"}`} />
              <span>Candidate Portal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPortal("ORG_HR");
                setError(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                !isCandidate
                  ? "bg-white text-blue-800 shadow-sm border border-blue-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Briefcase className={`w-4 h-4 ${!isCandidate ? "text-blue-600" : "text-slate-400"}`} />
              <span>HR / Employer</span>
            </button>
          </div>

          {/* Quick 1-Click Demo Login Bar */}
          <div
            className={`mb-4 p-3 rounded-xl border transition-all ${
              isCandidate
                ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                : "bg-blue-50/60 border-blue-200 text-blue-950"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Instant Test Sign-In</span>
                </p>
                <p className="text-[11px] opacity-80">
                  {isCandidate
                    ? "Demo Candidate (candidate@example.com)"
                    : "Demo HR Officer (hr@acme-corp.com)"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleQuickDemo(portal)}
                disabled={isSubmitting}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all shrink-0 text-white shadow-xs ${
                  isCandidate
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                1-Click Sign In
              </button>
            </div>
          </div>

          {/* Mode Switcher: Sign In vs Create Account */}
          <div className="flex border-b border-slate-200 mb-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`pb-2.5 px-4 transition-all relative ${
                mode === "login"
                  ? isCandidate
                    ? "text-emerald-700 font-bold border-b-2 border-emerald-600"
                    : "text-blue-700 font-bold border-b-2 border-blue-600"
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
              className={`pb-2.5 px-4 transition-all relative ${
                mode === "signup"
                  ? isCandidate
                    ? "text-emerald-700 font-bold border-b-2 border-emerald-600"
                    : "text-blue-700 font-bold border-b-2 border-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Create New Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {mode === "signup" && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isCandidate ? "e.g. John Doe" : "e.g. Helen HR"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-xs"
                  />
                </div>
              </div>
            )}

            {mode === "signup" && !isCandidate && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Company / Organization Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Acme Global Corporation"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-xs"
                  />
                </div>
              </div>
            )}

            {mode === "signup" && isCandidate && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {isCandidate ? "Email Address" : "Work Email Address"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isCandidate ? "candidate@example.com" : "hr@company.com"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-3 py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                isCandidate
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
              }`}
            >
              <span>
                {isSubmitting
                  ? "Authenticating..."
                  : mode === "login"
                  ? isCandidate
                    ? "Sign In to Candidate Portal"
                    : "Sign In to HR Workspace"
                  : isCandidate
                  ? "Create Candidate Account"
                  : "Create HR Enterprise Account"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Helpful context footnote */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => {
                setPortal(isCandidate ? "ORG_HR" : "CANDIDATE");
                setError(null);
              }}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              {isCandidate
                ? "Are you an employer or recruiter? Switch to HR Portal →"
                : "Are you a candidate verifying your records? Switch to Candidate Portal →"}
            </button>
          </div>
        </div>
=======
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
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
      </div>
    </div>
  );
}
