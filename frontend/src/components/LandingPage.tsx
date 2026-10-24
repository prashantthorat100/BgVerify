"use client";

import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Lock,
  ArrowRight,
  GraduationCap,
  Briefcase,
  UserCheck,
  FileText,
  Clock,
  CheckCircle,
  Building2,
  ChevronRight,
  Sparkles,
  Users,
  Search,
<<<<<<< HEAD
  Eye,
  KeyRound,
  UserPlus
} from "lucide-react";

interface LandingPageProps {
  onOpenAuth: (portal: "CANDIDATE" | "ORG_HR", mode: "login" | "signup") => void;
  onQuickDemo: (role: "ORG_HR" | "CANDIDATE") => void;
=======
  Eye
} from "lucide-react";

interface LandingPageProps {
  onOpenAuth: (mode: "login" | "signup", role?: "ADMIN" | "ORG_HR" | "CANDIDATE") => void;
  onQuickDemo: (role: "ADMIN" | "ORG_HR" | "CANDIDATE") => void;
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
}

export function LandingPage({ onOpenAuth, onQuickDemo }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Demo Helper Bar */}
<<<<<<< HEAD
      <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-emerald-50 border-b border-slate-200 px-4 py-2 text-center text-xs text-slate-700 flex items-center justify-center gap-2">
        <span className="font-semibold bg-blue-600 text-white px-2 py-0.5 rounded text-[11px] shadow-xs">
          Live Demonstrations Ready
        </span>
        <span className="hidden sm:inline text-slate-600">
          Select your dedicated portal to test workflows instantly:
        </span>
        <div className="inline-flex items-center gap-2 ml-1">
          <button
            onClick={() => onQuickDemo("ORG_HR")}
            className="font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>HR Portal Demo</span>
          </button>
          <span className="text-slate-400">•</span>
          <button
            onClick={() => onQuickDemo("CANDIDATE")}
            className="font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Candidate Portal Demo</span>
=======
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-center text-xs text-blue-900 flex items-center justify-center gap-2">
        <span className="font-semibold bg-blue-600 text-white px-2 py-0.5 rounded text-[11px]">
          Demo Ready
        </span>
        <span>
          Click any role to test the platform instantly:
        </span>
        <div className="inline-flex items-center gap-1.5 ml-1">
          <button
            onClick={() => onQuickDemo("ORG_HR")}
            className="font-medium underline hover:text-blue-700"
          >
            HR Portal
          </button>
          <span>•</span>
          <button
            onClick={() => onQuickDemo("CANDIDATE")}
            className="font-medium underline hover:text-blue-700"
          >
            Candidate Portal
          </button>
          <span>•</span>
          <button
            onClick={() => onQuickDemo("ADMIN")}
            className="font-medium underline hover:text-blue-700"
          >
            Admin Panel
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-sm px-6 md:px-12 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            BGVerify<span className="text-blue-600">.ai</span>
          </span>
        </div>

        {/* Center links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
<<<<<<< HEAD
          <a href="#portals" className="hover:text-blue-600 transition-colors">Portals</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
          <a href="#checks" className="hover:text-blue-600 transition-colors">Verification Types</a>
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
        </nav>

        {/* Action Buttons for Both Portals */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenAuth("CANDIDATE", "login")}
            className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all flex items-center gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Candidate Portal</span>
            <span className="sm:hidden">Candidate</span>
          </button>

          <button
            onClick={() => onOpenAuth("ORG_HR", "login")}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HR & Employer Portal</span>
            <span className="sm:hidden">HR Portal</span>
            <ArrowRight className="w-3 h-3" />
=======
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
          <a href="#checks" className="hover:text-blue-600 transition-colors">Verification Types</a>
          <a href="#features" className="hover:text-blue-600 transition-colors">Key Features</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth("login")}
            className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => onQuickDemo("ORG_HR")}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Try Live Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
          </button>
        </div>
      </header>

      {/* Hero Section */}
<<<<<<< HEAD
      <section className="px-6 md:px-12 pt-14 pb-16 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-6 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>Autonomous Background Verification & Fraud Detection</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-[1.15]">
          Fast, reliable background checks for modern hiring teams & candidates.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Verify college degrees, previous employment, and identity records in minutes with AI OCR. 
          Candidates securely upload documentation, and HR gets instant audit-ready reports.
        </p>

        {/* Dual Dedicated Portal Access Cards */}
        <div id="portals" className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto text-left">
          {/* Candidate Portal Card */}
          <div className="bg-white border-2 border-emerald-200 hover:border-emerald-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  Job Applicants
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Candidate Portal</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Invited to complete background verification? Track your active check, sign legal consent, and securely upload degree certificates & relieving letters.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenAuth("CANDIDATE", "login")}
                  className="w-full py-2 px-3 rounded-lg border border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => onOpenAuth("CANDIDATE", "signup")}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1 shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
              <button
                onClick={() => onQuickDemo("CANDIDATE")}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold transition-all text-center flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>1-Click Candidate Demo (candidate@example.com)</span>
              </button>
            </div>
          </div>

          {/* HR & Enterprise Portal Card */}
          <div className="bg-white border-2 border-blue-200 hover:border-blue-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                  HR & Employers
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">HR & Enterprise Portal</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Initiate verification requests, inspect automated OCR field comparisons, review high-risk flags, and manage organization verification quotas.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenAuth("ORG_HR", "login")}
                  className="w-full py-2 px-3 rounded-lg border border-blue-300 text-blue-800 hover:bg-blue-50 text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => onOpenAuth("ORG_HR", "signup")}
                  className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1 shadow-xs"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Register Org</span>
                </button>
              </div>
              <button
                onClick={() => onQuickDemo("ORG_HR")}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold transition-all text-center flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>1-Click HR Demo (hr@acme-corp.com)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Product Preview Card */}
=======
      <section className="px-6 md:px-12 pt-16 pb-20 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Automated Background Verification Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-[1.15]">
          Fast, reliable background checks for your hiring team.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Verify college degrees, previous employment, and identity documents in minutes. 
          Candidates securely upload records, OCR extracts the facts, and you get an audit-ready verified report.
        </p>

        {/* 1-Click Interactive Demo Selector */}
        <div className="mt-8 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-xl mx-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Click to launch live demonstration:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => onQuickDemo("ORG_HR")}
              className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-sm"
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>HR Manager</span>
            </button>
            <button
              onClick={() => onQuickDemo("CANDIDATE")}
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-sm"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Candidate Portal</span>
            </button>
            <button
              onClick={() => onQuickDemo("ADMIN")}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-sm"
            >
              <Lock className="w-4 h-4 text-slate-700" />
              <span>Platform Admin</span>
            </button>
          </div>
        </div>

        {/* Live Product Preview Card (Human-like, realistic report) */}
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
        <div className="mt-14 max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">John Doe</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  Verified • 98% Match
                </span>
              </div>
              <p className="text-xs text-slate-500">Ref: BGV-2026-9481 • Requested by Acme Global Corp</p>
            </div>
            <div className="text-xs text-slate-500">
              Completed in <span className="font-semibold text-slate-800">4 minutes</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Education Check</span>
              </div>
              <p className="text-slate-600">Stanford University</p>
              <p className="text-[11px] text-slate-500">B.S. in Computer Science (2017)</p>
              <span className="mt-2 inline-block text-[10px] font-bold text-emerald-600">✓ Transcript & Degree Verified</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Employment Check</span>
              </div>
              <p className="text-slate-600">TechCorp Global</p>
              <p className="text-[11px] text-slate-500">Senior Software Engineer (3 yrs)</p>
              <span className="mt-2 inline-block text-[10px] font-bold text-emerald-600">✓ Relieving Letter Matched</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Identity & Consent</span>
              </div>
              <p className="text-slate-600">Government ID Check</p>
              <p className="text-[11px] text-slate-500">Candidate Consent Signed</p>
              <span className="mt-2 inline-block text-[10px] font-bold text-emerald-600">✓ Tamper Check Clean</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white border-y border-slate-200 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
<<<<<<< HEAD
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Automated Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">How BGVerify.ai Works</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              Three simple steps from request initiation to completed audit-proof report.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">Initiate Check</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                HR enters candidate details or sends a self-upload invite. The candidate receives a secure link to provide consent and credentials.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">OCR & Comparison</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our OCR engine extracts key entities (dates, institutions, IDs, GPA) and compares them against declared records with fuzzy matching.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">Decision & Report</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verifications with high confidence auto-complete. Discrepancies are routed to the HR Review Queue with an immutable audit log.
=======
            <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-600">Simple 3-Step Process</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">How BGVerify works</h3>
            <p className="text-sm text-slate-600 mt-2">Clear, straightforward workflow for HR teams and candidates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">HR Requests Verification</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                HR enters the candidate&apos;s email and chooses the verification types (Education, Employment, or Identity). A secure invite is sent automatically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Candidate Submits Documents</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The candidate signs the digital consent form and uploads their degree certificate, payslips, or ID from their phone or laptop.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Instant Verified Report</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our OCR reads and cross-checks the text against reported claims. Clean matches are approved automatically; discrepancies are flagged for quick review.
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
              </p>
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Verification Types Section */}
      <section id="checks" className="py-16 bg-slate-50 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Verification Scope</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Multi-Domain Verification</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Education Credentials</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Verifies university degree certificates, transcripts, year of graduation, roll numbers, and institution accreditations.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5">
                <li className="flex items-center gap-1.5">✓ Degree Authenticity Check</li>
                <li className="flex items-center gap-1.5">✓ Graduation Year Alignment</li>
                <li className="flex items-center gap-1.5">✓ Document Integrity Hash</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Employment Records</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Validates previous employers, job titles, tenure dates, and exit/relieving letters to prevent resume padding.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5">
                <li className="flex items-center gap-1.5">✓ Relieving & Experience Letters</li>
                <li className="flex items-center gap-1.5">✓ Overlapping Employment Flagging</li>
                <li className="flex items-center gap-1.5">✓ Designation Verification</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Identity & Consent</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Checks candidate name, date of birth, government ID, and candidate informed consent records for full legal compliance.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5">
                <li className="flex items-center gap-1.5">✓ Government ID Verification</li>
                <li className="flex items-center gap-1.5">✓ Candidate Consent Trail</li>
                <li className="flex items-center gap-1.5">✓ Anomaly & Tamper Detection</li>
              </ul>
            </div>
=======
      {/* Verification Types */}
      <section id="checks" className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-600">Verification Modules</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">What we verify</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Education Credentials</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Cross-checks university name, awarded degree, major, graduation year, and GPA from uploaded marksheets or degrees.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li className="flex items-center gap-1.5">✓ Degree Authenticity Check</li>
              <li className="flex items-center gap-1.5">✓ Graduation Year Match</li>
              <li className="flex items-center gap-1.5">✓ Roll Number & Marks Validation</li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Work History</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Verifies former employer name, employment dates, job title, and relieving letters to prevent resume exaggeration.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li className="flex items-center gap-1.5">✓ Employment Date Matching</li>
              <li className="flex items-center gap-1.5">✓ Relieving Letter & Pay Slips</li>
              <li className="flex items-center gap-1.5">✓ Designation Verification</li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Identity & Consent</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Checks candidate name, date of birth, government ID, and candidate informed consent records for full legal compliance.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li className="flex items-center gap-1.5">✓ Government ID Verification</li>
              <li className="flex items-center gap-1.5">✓ Candidate Consent Trail</li>
              <li className="flex items-center gap-1.5">✓ Anomaly & Tamper Detection</li>
            </ul>
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
          </div>
        </div>
      </section>

      {/* Presentation Call to Action Banner */}
      <section className="bg-blue-600 text-white py-14 px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto">
<<<<<<< HEAD
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ready to test the portals?</h2>
          <p className="text-blue-100 text-sm mt-2 max-w-xl mx-auto">
            Experience the full verification workflow. Sign in or test as HR Manager or Candidate.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth("ORG_HR", "login")}
              className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Open HR Portal</span>
            </button>
            <button
              onClick={() => onOpenAuth("CANDIDATE", "login")}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl border border-blue-500 transition-all flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Open Candidate Portal</span>
=======
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ready to see the platform in action?</h2>
          <p className="text-blue-100 text-sm mt-2 max-w-xl mx-auto">
            Experience the full verification workflow. Switch roles instantly between HR Manager, Candidate, and Admin.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onQuickDemo("ORG_HR")}
              className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm rounded-xl shadow-sm transition-all"
            >
              Open HR Dashboard
            </button>
            <button
              onClick={() => onQuickDemo("CANDIDATE")}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-xl border border-blue-500 transition-all"
            >
              Open Candidate Portal
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6 md:px-12 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>BGVerify.ai</span>
          <span className="text-slate-400 font-normal">| Background Verification System</span>
        </div>
        <div>
<<<<<<< HEAD
          <span>Candidate & HR Authentication Portals Active</span>
=======
          <span>College / Capstone Project Demonstration</span>
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
        </div>
      </footer>
    </div>
  );
}
