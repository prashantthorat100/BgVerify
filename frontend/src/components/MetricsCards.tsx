"use client";

import React from "react";
import { DashboardMetrics } from "@/lib/types";
import {
  FileCheck2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Percent,
  ShieldAlert
} from "lucide-react";

interface MetricsCardsProps {
  metrics?: DashboardMetrics;
  quotaRemaining?: number;
}

export function MetricsCards({ metrics, quotaRemaining }: MetricsCardsProps) {
  if (!metrics) return null;

  const cards = [
    {
      title: "Total Verifications",
      value: metrics.total_verifications,
      sub: quotaRemaining !== undefined ? `${quotaRemaining} quota credits remaining` : "All-time across platform",
      icon: FileCheck2,
      iconColor: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "In Progress",
      value: metrics.processing_count + metrics.pending_count,
      sub: `${metrics.processing_count} in OCR & matching`,
      icon: Clock,
      iconColor: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Needs Review",
      value: metrics.manual_review_count,
      sub: "Requires HR approval",
      icon: AlertTriangle,
      iconColor: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      title: "Verified & Passed",
      value: metrics.completed_count,
      sub: `${metrics.total_verifications > 0 ? Math.round((metrics.completed_count / metrics.total_verifications) * 100) : 0}% success rate`,
      icon: CheckCircle2,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Avg Match Rate",
      value: `${Math.round(metrics.avg_confidence_score * 100)}%`,
      sub: "Overall accuracy",
      icon: Percent,
      iconColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      title: "Flagged Discrepancies",
      value: metrics.high_risk_flagged_count,
      sub: "Mismatched names/dates",
      icon: ShieldAlert,
      iconColor: "text-purple-600 bg-purple-50 border-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">{card.title}</span>
              <div className={`p-2 rounded-lg border ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-slate-900 mb-0.5">{card.value}</div>
              <p className="text-[11px] text-slate-500 truncate">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
