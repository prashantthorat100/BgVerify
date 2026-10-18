from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from app.models.enums import UserRole, VerificationStatus, VerificationType

class RecentActivityItem(BaseModel):
    id: str
    tracking_code: str
    candidate_name: str
    organization_name: Optional[str] = None
    verification_type: VerificationType
    status: VerificationStatus
    updated_at: datetime
    overall_confidence_score: Optional[float] = None
    fraud_risk_score: float = 0.0

class DashboardMetrics(BaseModel):
    total_verifications: int
    pending_count: int
    processing_count: int
    manual_review_count: int
    completed_count: int
    failed_count: int
    avg_confidence_score: float
    high_risk_flagged_count: int

class AdminDashboardStats(BaseModel):
    role: UserRole = UserRole.ADMIN
    total_organizations: int
    total_users: int
    metrics: DashboardMetrics
    recent_verifications: List[RecentActivityItem]
    system_health: Dict[str, Any]

class HRDashboardStats(BaseModel):
    role: UserRole = UserRole.ORG_HR
    organization_id: str
    organization_name: str
    quota_remaining: int
    metrics: DashboardMetrics
    recent_verifications: List[RecentActivityItem]

class CandidateDashboardStats(BaseModel):
    role: UserRole = UserRole.CANDIDATE
    candidate_id: str
    candidate_name: str
    assigned_verifications: List[RecentActivityItem]
    action_required_count: int
