"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  FileCheck2,
  Users,
  Building2,
  FolderLock,
  History,
  FileSearch,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Briefcase
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export function Sidebar({ currentTab, onSelectTab }: SidebarProps) {
  const { user } = useAuth();
  const role = user?.role || "ORG_HR";
  const isCandidate = role === "CANDIDATE";

  // Navigation items strictly configured for HR and Candidate portals
  const navItems = [
    {
      id: "candidate_portal",
      label: "My Tasks & Uploads",
      icon: CheckCircle,
      roles: ["CANDIDATE"],
    },
    {
      id: "dashboard",
      label: isCandidate ? "My Status Overview" : "Dashboard Overview",
      icon: LayoutDashboard,
      roles: ["ORG_HR", "CANDIDATE"],
    },
    {
      id: "verifications",
      label: "Verification Requests",
      icon: FileCheck2,
      roles: ["ORG_HR"],
    },
    {
      id: "review_queue",
      label: "Review Queue",
      icon: FileSearch,
      roles: ["ORG_HR"],
    },
    {
      id: "documents",
      label: isCandidate ? "My Credentials" : "Stored Documents",
      icon: FolderLock,
      roles: ["ORG_HR", "CANDIDATE"],
    },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* User Scope Banner */}
        <div
          className={`rounded-xl p-3 border transition-colors ${
            isCandidate
              ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
              : "bg-blue-50/70 border-blue-200 text-blue-950"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            {isCandidate ? (
              <GraduationCap className="w-4 h-4 text-emerald-600" />
            ) : (
              <Briefcase className="w-4 h-4 text-blue-600" />
            )}
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {isCandidate ? "Candidate Workspace" : "HR & Enterprise Portal"}
            </span>
          </div>
          <p className="text-xs font-semibold truncate">
            {isCandidate ? user?.full_name : (user?.organization_name || "Enterprise HR")}
          </p>
          <p className="text-[11px] opacity-75 truncate">{user?.email}</p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? isCandidate
                      ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-xs"
                      : "bg-blue-50 text-blue-800 font-bold border border-blue-200 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? isCandidate
                        ? "text-emerald-600"
                        : "text-blue-600"
                      : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100">
        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Authentication & RBAC Active</span>
        </div>
      </div>
    </aside>
  );
}
