"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MetricsCards } from "@/components/MetricsCards";
import { RecentActivityTable } from "@/components/RecentActivityTable";
import { LandingPage } from "@/components/LandingPage";
import { AuthModal } from "@/components/AuthModal";
import { TokenPurchaseModal } from "@/components/TokenPurchaseModal";
import { dashboardApi, orgApi, creditsApi } from "@/lib/api";
import { RecentActivityItem, DashboardMetrics } from "@/lib/types";
import {
  FilePlus,
  RefreshCw,
  Server,
  Cpu,
  Database,
  Building,
  CheckCircle,
  FileCheck2,
  Clock,
  Sparkles,
  Home as HomeIcon,
  LayoutDashboard,
  X,
  Upload,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  UserCheck,
  FileText,
  FolderLock,
  History,
  FileSearch,
  ExternalLink,
  Shield,
  Download,
  Check,
  Search,
  Filter,
  Zap,
  Coins
} from "lucide-react";

export default function Home() {
  const { user, isLoading: authLoading, switchDemoUser } = useAuth();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [statsData, setStatsData] = useState<any>(null);
  const [activityItems, setActivityItems] = useState<RecentActivityItem[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Landing vs Workspace view toggle
  const [viewMode, setViewMode] = useState<"landing" | "workspace">("workspace");

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");
  const [authModalPortal, setAuthModalPortal] = useState<"CANDIDATE" | "ORG_HR">("ORG_HR");

  // Token System State
  const [tokenBalance, setTokenBalance] = useState<number>(3); // Initial 3 demo tokens
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [tokenAlertBanner, setTokenAlertBanner] = useState<string | null>(null);
  const [analyzingDocId, setAnalyzingDocId] = useState<string | null>(null);

  // Interactive Verification Details Modal
  const [selectedVerification, setSelectedVerification] = useState<RecentActivityItem | null>(null);

  // Interactive New Verification Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateEmail, setNewCandidateEmail] = useState("");
  const [newVerificationType, setNewVerificationType] = useState<"EDUCATION" | "EMPLOYMENT" | "IDENTITY">("EDUCATION");

  // Candidate Upload Simulation State
  const [candidateFileUploaded, setCandidateFileUploaded] = useState(false);
  const [candidateRelievingUploaded, setCandidateRelievingUploaded] = useState(false);
  const [candidateConsentSigned, setCandidateConsentSigned] = useState(true);

  // Mock Documents for Stored Documents tab
  const [documentsList, setDocumentsList] = useState([
    {
      id: "doc-1",
      name: "Stanford_Degree_Certificate.pdf",
      candidate: "John Doe",
      type: "Degree Certificate",
      size: "2.4 MB",
      uploaded_at: "2 hours ago",
      status: "Verified",
      analyzed: true,
      hash: "sha256:7f83b165...e91",
    },
    {
      id: "doc-2",
      name: "TechCorp_Relieving_Letter.pdf",
      candidate: "Sarah Jenkins",
      type: "Employment Proof",
      size: "1.1 MB",
      uploaded_at: "5 hours ago",
      status: "Pending Analysis",
      analyzed: false,
      hash: "sha256:9c41a201...b84",
    },
    {
      id: "doc-3",
      name: "Government_ID_Proof.jpg",
      candidate: "John Doe",
      type: "National ID",
      size: "840 KB",
      uploaded_at: "1 day ago",
      status: "Verified",
      analyzed: true,
      hash: "sha256:3d28fa80...f12",
    },
    {
      id: "doc-4",
      name: "University_Marksheet_Final.pdf",
      candidate: "Michael Chang",
      type: "Official Transcript",
      size: "3.2 MB",
      uploaded_at: "2 days ago",
      status: "Pending Analysis",
      analyzed: false,
      hash: "sha256:1a58ee30...ca7",
    },
  ]);

  // Mock Audit Logs for Audit Trail tab
  const mockAuditLogs = [
    {
      id: "log-1",
      timestamp: "10 mins ago",
      actor: "Helen HR (hr@acme-corp.com)",
      action: "CREATED_VERIFICATION",
      target: "John Doe (BGV-2026-9481)",
      ip: "192.168.1.45",
      status: "Success",
    },
    {
      id: "log-2",
      timestamp: "25 mins ago",
      actor: "System OCR Engine",
      action: "EXTRACTED_FIELDS",
      target: "Stanford_Degree_Certificate.pdf",
      ip: "127.0.0.1",
      status: "Success (98% Conf)",
    },
    {
      id: "log-3",
      timestamp: "1 hour ago",
      actor: "John Doe (candidate@example.com)",
      action: "CONSENT_SIGNED",
      target: "Candidate Consent Agreement",
      ip: "104.28.19.12",
      status: "Success",
    },
    {
      id: "log-4",
      timestamp: "2 hours ago",
      actor: "Admin (admin@bgverify.ai)",
      action: "UPDATED_TENANT_QUOTA",
      target: "Acme Global Corporation (+500)",
      ip: "192.168.1.10",
      status: "Success",
    },
    {
      id: "log-5",
      timestamp: "4 hours ago",
      actor: "Reviewer Helen HR",
      action: "MANUAL_OVERRIDE_APPROVED",
      target: "Sarah Jenkins (BGV-2026-4210)",
      ip: "192.168.1.45",
      status: "Approved",
    },
  ];

  const openAuth = (portal: "CANDIDATE" | "ORG_HR", mode: "login" | "signup" = "login") => {
    setAuthModalPortal(portal);
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleQuickDemo = async (role: "ORG_HR" | "CANDIDATE") => {
    await switchDemoUser(role);
    setViewMode("workspace");
    if (role === "CANDIDATE") {
      setCurrentTab("candidate_portal");
    } else {
      setCurrentTab("dashboard");
    }
  };

  const fetchDashboardData = async () => {
    if (!user) return;
    setIsRefreshing(true);
    try {
      const stats = await dashboardApi.getStats();
      setStatsData(stats);

      const activities = await dashboardApi.getRecentActivity({
        search: searchQuery,
        status: statusFilter,
      });
      setActivityItems(activities);

      if (user.role === "ADMIN") {
        const orgs = await orgApi.list();
        setOrganizations(orgs);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === "CANDIDATE" && currentTab !== "candidate_portal" && currentTab !== "documents" && currentTab !== "dashboard") {
        setCurrentTab("candidate_portal");
      } else if (user.role === "ORG_HR" && currentTab === "candidate_portal") {
        setCurrentTab("dashboard");
      }
      fetchDashboardData();
      creditsApi
        .getBalance()
        .then((res) => {
          if (res && typeof res.token_balance === "number") {
            setTokenBalance(Math.min(res.token_balance, 50));
          }
        })
        .catch(() => {});
    }
  }, [user, searchQuery, statusFilter]);

  // Token-Gated Action: Analyze Document
  const handleAnalyzeDocument = async (docId: string) => {
    if (tokenBalance < 1) {
      setTokenAlertBanner(
        "⚡ Insufficient Tokens: You must purchase tokens before you can analyze or OCR-verify this document."
      );
      setIsPurchaseModalOpen(true);
      return;
    }

    setAnalyzingDocId(docId);
    try {
      await creditsApi.deduct("DOCUMENT_OCR_ANALYSIS", 1);
    } catch (e) {
      // offline fallback
    }

    setTokenBalance((prev) => Math.max(0, prev - 1));

    setTimeout(() => {
      setDocumentsList((prev) =>
        prev.map((d) =>
          d.id === docId ? { ...d, status: "Verified (98% Match)", analyzed: true } : d
        )
      );
      setAnalyzingDocId(null);
    }, 1200);
  };

  // Token-Gated Action: Create Verification
  const handleCreateVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName || !newCandidateEmail) return;

    if (tokenBalance < 1) {
      setTokenAlertBanner(
        "⚡ Insufficient Tokens: You need at least 1 token to initiate a new verification check. Please purchase tokens to proceed."
      );
      setIsPurchaseModalOpen(true);
      return;
    }

    try {
      await creditsApi.deduct("VERIFICATION_REQUEST", 1);
    } catch (e) {
      // offline fallback
    }

    setTokenBalance((prev) => Math.max(0, prev - 1));

    const newReq: RecentActivityItem = {
      id: "req-" + Date.now(),
      tracking_code: `BGV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      candidate_name: newCandidateName,
      candidate_email: newCandidateEmail,
      verification_type: newVerificationType,
      status: "PROCESSING",
      overall_confidence_score: 0.94,
      confidence_score: 0.94,
      fraud_risk_score: 0.04,
      updated_at: new Date().toISOString(),
    };

    setActivityItems([newReq, ...activityItems]);
    setIsNewModalOpen(false);
    setNewCandidateName("");
    setNewCandidateEmail("");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Loading BGVerify.ai Workspace...</p>
        </div>
      </div>
    );
  }

  // Show Landing Page if unauthenticated OR user explicitly switched to "landing" view
  if (!user || viewMode === "landing") {
    return (
      <>
        {user && (
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50">
            <span className="text-slate-300">
              Active Session: <strong className="text-white">{user.full_name}</strong> ({user.role})
            </span>
            <button
              onClick={() => setViewMode("workspace")}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Open Dashboard Workspace</span>
            </button>
          </div>
        )}
        <LandingPage onOpenAuth={openAuth} onQuickDemo={handleQuickDemo} />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialPortal={authModalPortal}
          initialMode={authModalMode}
        />
      </>
    );
  }

  const metrics: DashboardMetrics | undefined = statsData?.metrics;

  // Filter items for Review Queue
  const reviewQueueItems = activityItems.filter(
    (item) =>
      item.status === "MANUAL_REVIEW" ||
      item.fraud_risk_score > 0.3 ||
      (item.overall_confidence_score && item.overall_confidence_score < 0.8)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar
        onViewLanding={() => setViewMode("landing")}
        tokenBalance={tokenBalance}
        onOpenPurchaseModal={() => setIsPurchaseModalOpen(true)}
      />

      <div className="flex-1 flex">
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-7xl">
          {/* Mobile Tab Navigation Bar */}
          <div className="flex md:hidden overflow-x-auto gap-2 pb-2 border-b border-slate-200">
            <button
              onClick={() => setCurrentTab("dashboard")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
                currentTab === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              Dashboard
            </button>
            {user.role !== "CANDIDATE" && (
              <>
                <button
                  onClick={() => setCurrentTab("verifications")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
                    currentTab === "verifications"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  Verifications
                </button>
                <button
                  onClick={() => setCurrentTab("review_queue")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
                    currentTab === "review_queue"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  Review Queue
                </button>
              </>
            )}
            {user.role === "CANDIDATE" && (
              <button
                onClick={() => setCurrentTab("candidate_portal")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
                  currentTab === "candidate_portal"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                My Tasks
              </button>
            )}
            <button
              onClick={() => setCurrentTab("documents")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
                currentTab === "documents"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              Documents
            </button>
            {user.role === "ADMIN" && (
              <>
                <button
                  onClick={() => setCurrentTab("organizations")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
                    currentTab === "organizations"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  Companies
                </button>
                <button
                  onClick={() => setCurrentTab("audit_logs")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
                    currentTab === "audit_logs"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  Audit Trail
                </button>
              </>
            )}
          </div>

          {/* Low Token Alert Banner */}
          {tokenBalance === 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between text-xs text-amber-900 shadow-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold">You have 0 verification tokens left.</span>
                  <p className="text-amber-800 text-[11px] mt-0.5">
                    Document analysis and new verification requests require tokens. Please purchase a token pack to continue.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPurchaseModalOpen(true)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shrink-0 shadow-xs transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Purchase Tokens</span>
              </button>
            </div>
          )}

          {/* Header & Quick Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                {currentTab === "dashboard" &&
                  (user.role === "ADMIN"
                    ? "Platform Administration Overview"
                    : user.role === "ORG_HR"
                    ? `${user.organization_name || "Enterprise"} HR Dashboard`
                    : "Candidate Verification Portal")}
                {currentTab === "verifications" && "Verification Requests Management"}
                {currentTab === "review_queue" && "Human Review & Discrepancies Queue"}
                {currentTab === "candidate_portal" && "Candidate Tasks & Evidence Submission"}
                {currentTab === "documents" && "Stored Documents & Evidence Vault"}
                {currentTab === "organizations" && "Company Accounts & Verification Quotas"}
                {currentTab === "audit_logs" && "System Compliance & Audit Trail"}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentTab === "dashboard" && "Real-time verification metrics and recent activity"}
                {currentTab === "verifications" && "Track, filter, and inspect all candidate verification requests"}
                {currentTab === "review_queue" && "Review candidate claims flagged for human sign-off"}
                {currentTab === "candidate_portal" && "Review your verification consent and upload official records"}
                {currentTab === "documents" && "Encrypted evidence files with SHA-256 tamper verification"}
                {currentTab === "organizations" && "Manage enterprise tenants and allocated verification quotas"}
                {currentTab === "audit_logs" && "Immutable chronological log of all security and verification events"}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Token Purchase Quick Button */}
              <button
                onClick={() => setIsPurchaseModalOpen(true)}
                className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>{tokenBalance} Tokens</span>
                <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.2 rounded">+ Buy</span>
              </button>

              <button
                onClick={fetchDashboardData}
                disabled={isRefreshing}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh Data</span>
              </button>

              {user.role === "ORG_HR" && (
                <button
                  onClick={() => setIsNewModalOpen(true)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>+ New Verification</span>
                </button>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ========================================================= */}
          {currentTab === "dashboard" && (
            <div className="space-y-6">
              {/* Token System Announcement Card */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Token Balance: <span className="text-blue-700 font-extrabold">{tokenBalance} Tokens Available</span>
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      1 Token is deducted per document analyzed or verification check initiated.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPurchaseModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Top Up Credits</span>
                </button>
              </div>

              {/* Role: Candidate Specific Banner if on dashboard */}
              {user.role === "CANDIDATE" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        Candidate Verification Status
                      </span>
                      <h2 className="text-xl font-bold text-slate-900 mt-2">Welcome, {user.full_name}</h2>
                      <p className="text-xs text-slate-600 mt-1 max-w-xl">
                        Your employer has requested credential verification. Switch to the <strong>My Tasks & Uploads</strong> tab to submit documents.
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentTab("candidate_portal")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      Open Candidate Tasks ➔
                    </button>
                  </div>
                </div>
              )}

              {/* Metrics Section for Admin / HR */}
              {user.role !== "CANDIDATE" && (
                <MetricsCards metrics={metrics} quotaRemaining={tokenBalance} />
              )}

              {/* System Health Status Panel (Admin only) */}
              {user.role === "ADMIN" && statsData?.system_health && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                    System Infrastructure Status
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-slate-500 text-[11px]">OCR Engine</div>
                        <div className="font-bold text-slate-800">{statsData.system_health.ocr_service_status}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <Server className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div className="text-slate-500 text-[11px]">Browser Automation</div>
                        <div className="font-bold text-slate-800">{statsData.system_health.automation_engine}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-slate-500 text-[11px]">Database Mode</div>
                        <div className="font-bold text-slate-800">{statsData.system_health.database_mode}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="text-slate-500 text-[11px]">Active Workers</div>
                        <div className="font-bold text-slate-800">
                          {statsData.system_health.active_queue_workers} Local workers
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Activity Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Recent Verification Activity</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-slate-200/70 text-slate-700">
                      {activityItems.length} records
                    </span>
                  </h2>
                </div>

                <RecentActivityTable
                  items={activityItems}
                  onSearchChange={setSearchQuery}
                  onStatusChange={setStatusFilter}
                  selectedStatus={statusFilter}
                  onViewDetails={(item) => setSelectedVerification(item)}
                />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: VERIFICATION REQUESTS */}
          {/* ========================================================= */}
          {currentTab === "verifications" && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  Showing <strong>{activityItems.length}</strong> total background verification requests in your workspace.
                </div>
                {user.role === "ORG_HR" && (
                  <button
                    onClick={() => setIsNewModalOpen(true)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <FilePlus className="w-3.5 h-3.5" />
                    <span>Initiate Check (1 Token)</span>
                  </button>
                )}
              </div>

              <RecentActivityTable
                items={activityItems}
                onSearchChange={setSearchQuery}
                onStatusChange={setStatusFilter}
                selectedStatus={statusFilter}
                onViewDetails={(item) => setSelectedVerification(item)}
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: REVIEW QUEUE */}
          {/* ========================================================= */}
          {currentTab === "review_queue" && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-900">Human-in-the-Loop Review Required</h3>
                  <p className="text-amber-800 mt-0.5">
                    The items below were flagged by the OCR and comparison engine due to slight text differences, date variances, or partial name matches. Review and override or approve.
                  </p>
                </div>
              </div>

              {reviewQueueItems.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-800 text-sm">Review Queue is Clear!</p>
                  <p className="text-xs text-slate-500 mt-1">No candidate files currently require manual inspection.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviewQueueItems.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                            {item.verification_type} Review Needed
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm mt-1">{item.candidate_name}</h3>
                          <p className="text-[11px] text-slate-500 font-mono">{item.tracking_code}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-amber-600">
                            {Math.round(
                              (item.overall_confidence_score ?? item.confidence_score ?? 0.72) * 100
                            )}
                            % Match
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Reported Claim:</span>
                          <span className="font-semibold text-slate-800">Stanford University (2018)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">OCR Extracted:</span>
                          <span className="font-semibold text-amber-700">Stanford Univ (June 2017)</span>
                        </div>
                        <div className="text-[11px] text-amber-700 font-medium pt-1 border-t border-slate-200/60">
                          ⚠ Flag: 1-year discrepancy between self-reported graduation and certificate issue date.
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => {
                            alert(`Override approved for ${item.candidate_name}`);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                        >
                          ✓ Approve with Note
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVerification(item);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          Inspect Document
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: CANDIDATE PORTAL */}
          {/* ========================================================= */}
          {currentTab === "candidate_portal" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      Assigned Tasks
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">Candidate Evidence Portal</h2>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl">
                      Upload your official documents below. Once uploaded, you can trigger OCR analysis (1 Token per document) to generate your verified audit report.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className={`w-3 h-3 rounded-full ${candidateConsentSigned ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                    <div className="text-xs">
                      <p className="font-bold text-slate-800">Consent Status</p>
                      <p className="text-[11px] text-emerald-600 font-semibold">
                        {candidateConsentSigned ? "Digitally Signed & Acknowledged" : "Action Required"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Candidate Tasks */}
                <div className="mt-6 space-y-4">
                  {/* Task 1: Consent */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Informed Background Check Consent</h4>
                        <p className="text-[11px] text-slate-500">Signed on {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Completed</span>
                  </div>

                  {/* Task 2: Degree Upload */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          candidateFileUploaded ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {candidateFileUploaded ? <Check className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Degree Certificate / Official Marksheet</h4>
                        <p className="text-[11px] text-slate-500">
                          {candidateFileUploaded ? "Stanford_Degree_Certificate.pdf (2.4 MB)" : "Required for Education Verification"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCandidateFileUploaded(!candidateFileUploaded)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
                      >
                        {candidateFileUploaded ? "Replace File" : "Upload File"}
                      </button>
                      {candidateFileUploaded && (
                        <button
                          onClick={() => handleAnalyzeDocument("doc-1")}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Analyze (1 Token)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Task 3: Experience Letter Upload */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          candidateRelievingUploaded ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {candidateRelievingUploaded ? <Check className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Relieving Letter or Experience Proof</h4>
                        <p className="text-[11px] text-slate-500">
                          {candidateRelievingUploaded ? "TechCorp_Relieving_Letter.pdf (1.1 MB)" : "Required for Employment Verification"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCandidateRelievingUploaded(!candidateRelievingUploaded)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
                      >
                        {candidateRelievingUploaded ? "Replace File" : "Upload File"}
                      </button>
                      {candidateRelievingUploaded && (
                        <button
                          onClick={() => handleAnalyzeDocument("doc-2")}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Analyze (1 Token)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: STORED DOCUMENTS & TOKEN GATED OCR */}
          {/* ========================================================= */}
          {currentTab === "documents" && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">Encrypted Document Storage</h3>
                  <p className="text-[11px] text-slate-500">
                    Each document OCR extraction consumes <strong>1 Token</strong>. Current balance: <strong>{tokenBalance} Tokens</strong>.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPurchaseModalOpen(true)}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span>Buy More Tokens</span>
                  </button>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    SHA-256 Validated
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Document Name</th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Analysis Status</th>
                      <th className="py-3 px-4">Integrity Hash</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documentsList.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span>{doc.name}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">{doc.candidate}</td>
                        <td className="py-3.5 px-4 text-slate-500">{doc.type}</td>
                        <td className="py-3.5 px-4">
                          {doc.analyzed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" /> Needs Analysis
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{doc.hash}</td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {!doc.analyzed ? (
                            <button
                              onClick={() => handleAnalyzeDocument(doc.id)}
                              disabled={analyzingDocId === doc.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all disabled:opacity-50"
                            >
                              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                              <span>{analyzingDocId === doc.id ? "Analyzing..." : "Analyze (1 Token)"}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => alert(`Opening verified report for ${doc.name}`)}
                              className="text-blue-600 hover:text-blue-700 font-semibold text-xs px-2 py-1 rounded hover:bg-blue-50"
                            >
                              View Report
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: ORGANIZATIONS (ADMIN ONLY) */}
          {/* ========================================================= */}
          {currentTab === "organizations" && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Registered Enterprise Tenants</h3>
                    <p className="text-xs text-slate-500">Active customer accounts and allocated verification quota limits</p>
                  </div>
                  <button
                    onClick={() => alert("Add Organization modal activates in Phase 2!")}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    + Add Organization
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {organizations.map((org) => (
                    <div key={org.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700">
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{org.name}</div>
                          <div className="text-[11px] text-slate-500">{org.domain || org.slug}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-800">{org.verification_quota} Quota</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">Active Tenant</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: AUDIT LOGS (ADMIN ONLY) */}
          {/* ========================================================= */}
          {currentTab === "audit_logs" && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">Immutable Audit Trail</h3>
                  <p className="text-[11px] text-slate-500">
                    Every security, token purchase, extraction, and verification action is cryptographically logged.
                  </p>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  Compliance Ready
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Event Action</th>
                      <th className="py-3 px-4">Target Resource</th>
                      <th className="py-3 px-4">IP Address</th>
                      <th className="py-3 px-4 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {mockAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-slate-500 font-sans">{log.timestamp}</td>
                        <td className="py-3 px-4 text-slate-800 font-sans font-semibold">{log.actor}</td>
                        <td className="py-3 px-4 text-blue-700 font-bold">{log.action}</td>
                        <td className="py-3 px-4 text-slate-600 font-sans">{log.target}</td>
                        <td className="py-3 px-4 text-slate-500">{log.ip}</td>
                        <td className="py-3 px-4 text-right text-emerald-600 font-sans font-bold">{log.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Token Purchase Modal */}
      <TokenPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        currentBalance={tokenBalance}
        onSuccess={(newBalance) => {
          setTokenBalance(newBalance);
          setTokenAlertBanner(null);
        }}
      />

      {/* Interactive Verification Details Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedVerification.verification_type} Check
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedVerification.candidate_name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedVerification.tracking_code}
                </p>
              </div>
              <button
                onClick={() => setSelectedVerification(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification Content Body */}
            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[11px]">Candidate Email</span>
                  <p className="font-semibold text-slate-800">
                    {selectedVerification.candidate_email ||
                      `${selectedVerification.candidate_name.toLowerCase().replace(/\s+/g, ".")}@example.com`}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Match Confidence</span>
                  <p className="font-bold text-emerald-600">
                    {selectedVerification.overall_confidence_score ?? selectedVerification.confidence_score
                      ? `${Math.round(
                          ((selectedVerification.overall_confidence_score ??
                            selectedVerification.confidence_score) as number) * 100
                        )}% Match`
                      : "Pending OCR"}
                  </p>
                </div>
              </div>

              {/* Claimed vs Verified Data Comparison */}
              <div className="border border-slate-200 rounded-xl p-3">
                <p className="font-bold text-slate-800 mb-2">Comparison Summary</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">Claimed Institution:</span>
                    <span className="font-semibold text-slate-800">Stanford University</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">OCR Extracted:</span>
                    <span className="font-semibold text-emerald-700">Stanford University (Match)</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Degree & Year:</span>
                    <span className="font-semibold text-slate-800">B.S. in Computer Science (2017)</span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    alert(`Verification ${selectedVerification.tracking_code} marked as Approved!`);
                    setSelectedVerification(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
                >
                  ✓ Approve & Generate PDF
                </button>
                <button
                  onClick={() => {
                    alert(`Verification ${selectedVerification.tracking_code} flagged for HR review!`);
                    setSelectedVerification(null);
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition-colors"
                >
                  Flag for Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive New Verification Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">New Verification Request</h3>
                <p className="text-xs text-slate-500">Initiate automated background check (Costs 1 Token)</p>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVerification} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Candidate Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex.rivera@example.com"
                  value={newCandidateEmail}
                  onChange={(e) => setNewCandidateEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Verification Check Type</label>
                <select
                  value={newVerificationType}
                  onChange={(e) => setNewVerificationType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-xs"
                >
                  <option value="EDUCATION">Education Verification (Degree/College)</option>
                  <option value="EMPLOYMENT">Employment Verification (Past Company)</option>
                  <option value="IDENTITY">Identity Verification (Government ID)</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                <span>Cost: <strong>1 Token</strong></span>
                <span>Current Balance: <strong>{tokenBalance} Tokens</strong></span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Use 1 Token & Create</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
