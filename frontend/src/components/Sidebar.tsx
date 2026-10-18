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
  ShieldAlert
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export function Sidebar({ currentTab, onSelectTab }: SidebarProps) {
  const { user } = useAuth();
  const role = user?.role || "ORG_HR";

  const navItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard, roles: ["ADMIN", "ORG_HR", "CANDIDATE"] },
    { id: "verifications", label: "Verification Requests", icon: FileCheck2, roles: ["ADMIN", "ORG_HR"] },
    { id: "review_queue", label: "Review Queue", icon: FileSearch, roles: ["ADMIN", "ORG_HR"] },
    { id: "candidate_portal", label: "My Tasks & Uploads", icon: CheckCircle, roles: ["CANDIDATE"] },
    { id: "documents", label: "Stored Documents", icon: FolderLock, roles: ["ADMIN", "ORG_HR", "CANDIDATE"] },
    { id: "organizations", label: "Company Accounts", icon: Building2, roles: ["ADMIN"] },
    { id: "audit_logs", label: "Audit & Security Trail", icon: History, roles: ["ADMIN"] },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* User Scope Banner */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              {role === "ADMIN" ? "Platform Admin" : role === "ORG_HR" ? "HR Portal" : "Candidate Workspace"}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate font-medium">
            {role === "ORG_HR" ? (user?.organization_name || "Acme Global") : user?.email}
          </p>
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-bold border border-blue-100 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-500"}`} />
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
          <span>System Healthy • Local SQLite</span>
        </div>
      </div>
    </aside>
  );
}
