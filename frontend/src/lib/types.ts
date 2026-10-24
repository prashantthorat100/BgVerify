export type UserRole = "ADMIN" | "ORG_HR" | "CANDIDATE";

export type VerificationType = "EDUCATION" | "EMPLOYMENT" | "IDENTITY";

export type VerificationStatus =
  | "CREATED"
  | "CONSENT_PENDING"
  | "PENDING"
  | "PROCESSING"
  | "EVIDENCE_COLLECTION"
  | "AI_REVIEW"
  | "MANUAL_REVIEW"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export interface UserSession {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization_id?: string | null;
  organization_name?: string | null;
}

export interface RecentActivityItem {
  id: string;
  tracking_code: string;
  candidate_name: string;
  candidate_email?: string;
  organization_name?: string | null;
  verification_type: VerificationType;
  status: VerificationStatus;
  updated_at: string;
  overall_confidence_score?: number | null;
  confidence_score?: number | null;
  fraud_risk_score: number;
}

export interface DashboardMetrics {
  total_verifications: number;
  pending_count: number;
  processing_count: number;
  manual_review_count: number;
  completed_count: number;
  failed_count: number;
  avg_confidence_score: number;
  high_risk_flagged_count: number;
}

export interface AdminDashboardData {
  role: "ADMIN";
  total_organizations: number;
  total_users: number;
  metrics: DashboardMetrics;
  recent_verifications: RecentActivityItem[];
  system_health: {
    ocr_service_status: string;
    automation_engine: string;
    database_mode: string;
    active_queue_workers: number;
  };
}

export interface HRDashboardData {
  role: "ORG_HR";
  organization_id: string;
  organization_name: string;
  quota_remaining: number;
  metrics: DashboardMetrics;
  recent_verifications: RecentActivityItem[];
}

export interface CandidateDashboardData {
  role: "CANDIDATE";
  candidate_id: string;
  candidate_name: string;
  assigned_verifications: RecentActivityItem[];
  action_required_count: number;
}
