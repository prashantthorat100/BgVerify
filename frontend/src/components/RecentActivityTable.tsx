"use client";

import React, { useState } from "react";
import { RecentActivityItem, VerificationStatus } from "@/lib/types";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  ShieldAlert,
  ArrowUpRight,
  GraduationCap,
  Briefcase,
  UserCheck,
  ChevronRight
} from "lucide-react";

interface RecentActivityTableProps {
  items: RecentActivityItem[];
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  selectedStatus: string;
  onViewDetails?: (item: RecentActivityItem) => void;
}

export function RecentActivityTable({
  items,
  onSearchChange,
  onStatusChange,
  selectedStatus,
  onViewDetails,
}: RecentActivityTableProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    onSearchChange(e.target.value);
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
          </span>
        );
      case "MANUAL_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Needs Review
          </span>
        );
      case "PROCESSING":
      case "EVIDENCE_COLLECTION":
      case "AI_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" /> Processing
          </span>
        );
      case "CONSENT_PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <FileText className="w-3.5 h-3.5 text-purple-600" /> Consent Pending
          </span>
        );
      case "FAILED":
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5 text-slate-500" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EDUCATION":
        return <GraduationCap className="w-3.5 h-3.5 text-blue-600" />;
      case "EMPLOYMENT":
        return <Briefcase className="w-3.5 h-3.5 text-indigo-600" />;
      case "IDENTITY":
      default:
        return <UserCheck className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name or tracking code..."
            value={searchInput}
            onChange={handleSearch}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter verifications by status"
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Verified</option>
            <option value="MANUAL_REVIEW">Needs Review</option>
            <option value="PROCESSING">Processing</option>
            <option value="CONSENT_PENDING">Consent Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
            <tr>
              <th className="py-3 px-4">Candidate</th>
              <th className="py-3 px-4">Tracking ID</th>
              <th className="py-3 px-4">Verification Type</th>
              <th className="py-3 px-4">Confidence Score</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700 text-sm">No verifications found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filters.</p>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onViewDetails && onViewDetails(item)}
                >
                  {/* Candidate */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {item.candidate_name
                          ? item.candidate_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                          : "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.candidate_name}
                        </div>
                        <div className="text-[11px] text-slate-500">{item.candidate_email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Tracking Code */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                    {item.tracking_code}
                  </td>

                  {/* Verification Type */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {getTypeIcon(item.verification_type)}
                      {item.verification_type}
                    </span>
                  </td>

                  {/* Confidence Score */}
                  <td className="py-3.5 px-4">
                    {(() => {
                      const score = item.overall_confidence_score ?? item.confidence_score;
                      return score !== null && score !== undefined ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                score >= 0.8
                                  ? "bg-emerald-500"
                                  : score >= 0.5
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }`}
                              style={{ width: `${Math.round(score * 100)}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-700">
                            {Math.round(score * 100)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Pending</span>
                      );
                    })()}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onViewDetails) onViewDetails(item);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1 border border-transparent hover:border-blue-100"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
