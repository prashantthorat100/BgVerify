"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { ShieldCheck, LogOut, UserCircle2, ArrowRightLeft, ExternalLink, Zap, Briefcase, GraduationCap } from "lucide-react";

interface NavbarProps {
  onViewLanding?: () => void;
  tokenBalance?: number;
  onOpenPurchaseModal?: () => void;
}

export function Navbar({ onViewLanding, tokenBalance, onOpenPurchaseModal }: NavbarProps) {
  const { user, logout, switchDemoUser, isLoading } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            BGVerify<span className="text-blue-600">.ai</span>
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {user?.role === "CANDIDATE" ? "Candidate Workspace" : "HR Portal"}
          </span>
        </div>
      </div>

      {/* Demo Switcher & Session Controls */}
      <div className="flex items-center gap-3">
        {/* Token Balance Pill for HR */}
        {user?.role !== "CANDIDATE" && tokenBalance !== undefined && onOpenPurchaseModal && (
          <button
            onClick={onOpenPurchaseModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-all shadow-xs"
            title="Click to buy more verification tokens"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{tokenBalance} {tokenBalance === 1 ? "Token" : "Tokens"}</span>
            <span className="text-[10px] bg-amber-600 hover:bg-amber-700 text-white px-1.5 py-0.5 rounded font-semibold ml-0.5">
              + Buy
            </span>
          </button>
        )}

        {/* Quick Role Switcher (HR & Candidate Only - No Admin) */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500 px-2 flex items-center gap-1 font-medium text-[11px]">
            <ArrowRightLeft className="w-3 h-3 text-slate-400" /> Switch Portal:
          </span>
          <button
            onClick={() => switchDemoUser("ORG_HR")}
            disabled={isLoading}
            className={`px-3 py-1 rounded-lg transition-all font-semibold flex items-center gap-1.5 ${
              user?.role === "ORG_HR"
                ? "bg-white text-blue-700 shadow-xs border border-slate-200 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            <span>HR Manager</span>
          </button>
          <button
            onClick={() => switchDemoUser("CANDIDATE")}
            disabled={isLoading}
            className={`px-3 py-1 rounded-lg transition-all font-semibold flex items-center gap-1.5 ${
              user?.role === "CANDIDATE"
                ? "bg-white text-emerald-700 shadow-xs border border-slate-200 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Candidate</span>
          </button>
        </div>

        {onViewLanding && (
          <button
            onClick={onViewLanding}
            className="text-xs text-slate-600 hover:text-blue-600 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1"
            title="View Portals & Landing Page"
          >
            <span>Landing Page</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>
        )}

        {/* User Info & Logout */}
        {user ? (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{user.full_name}</p>
              <p className="text-[11px] text-slate-500">
                {user.role === "ORG_HR" ? "HR Officer" : "Candidate"}
                {user.role === "ORG_HR" && user.organization_name ? ` • ${user.organization_name}` : ""}
              </p>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <UserCircle2 className="w-4 h-4" />
            <span>Not Signed In</span>
          </div>
        )}
      </div>
    </header>
  );
}
