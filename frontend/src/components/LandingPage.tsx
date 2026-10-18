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
  Eye
} from "lucide-react";

interface LandingPageProps {
  onOpenAuth: (mode: "login" | "signup", role?: "ADMIN" | "ORG_HR" | "CANDIDATE") => void;
  onQuickDemo: (role: "ADMIN" | "ORG_HR" | "CANDIDATE") => void;
}

export function LandingPage({ onOpenAuth, onQuickDemo }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Demo Helper Bar */}
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
          </button>
        </div>
      </header>

      {/* Hero Section */}
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
              </p>
            </div>
          </div>
        </div>
      </section>

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
          </div>
        </div>
      </section>

      {/* Presentation Call to Action Banner */}
      <section className="bg-blue-600 text-white py-14 px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto">
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
          <span>College / Capstone Project Demonstration</span>
        </div>
      </footer>
    </div>
  );
}
