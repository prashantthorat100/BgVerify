from typing import List, Optional, Any, Dict
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.api.deps import get_db, get_current_user
from app.models.entities import (
    User, Organization, VerificationRequest, Candidate, AuditLog
)
from app.models.enums import UserRole, VerificationStatus, VerificationType
from app.schemas.dashboard import (
    DashboardMetrics, RecentActivityItem, AdminDashboardStats, HRDashboardStats, CandidateDashboardStats
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

def compute_metrics(query) -> DashboardMetrics:
    total = query.count()
    pending = query.filter(VerificationRequest.status.in_([
        VerificationStatus.CREATED,
        VerificationStatus.CONSENT_PENDING,
        VerificationStatus.PENDING
    ])).count()
    processing = query.filter(VerificationRequest.status.in_([
        VerificationStatus.PROCESSING,
        VerificationStatus.EVIDENCE_COLLECTION,
        VerificationStatus.AI_REVIEW
    ])).count()
    manual_review = query.filter(VerificationRequest.status == VerificationStatus.MANUAL_REVIEW).count()
    completed = query.filter(VerificationRequest.status == VerificationStatus.COMPLETED).count()
    failed = query.filter(VerificationRequest.status.in_([
        VerificationStatus.FAILED,
        VerificationStatus.CANCELLED
    ])).count()

    # Average confidence calculation
    avg_score_res = query.filter(VerificationRequest.overall_confidence_score.isnot(None))\
                         .with_entities(func.avg(VerificationRequest.overall_confidence_score)).scalar()
    avg_score = round(float(avg_score_res), 2) if avg_score_res else 0.0

    # High fraud risk count (> 0.50)
    flagged = query.filter(VerificationRequest.fraud_risk_score >= 0.50).count()

    return DashboardMetrics(
        total_verifications=total,
        pending_count=pending,
        processing_count=processing,
        manual_review_count=manual_review,
        completed_count=completed,
        failed_count=failed,
        avg_confidence_score=avg_score,
        high_risk_flagged_count=flagged
    )

def map_recent_activities(verifications: List[VerificationRequest]) -> List[RecentActivityItem]:
    items = []
    for v in verifications:
        candidate_name = v.candidate.full_name if v.candidate else "Unknown Candidate"
        org_name = v.organization.name if v.organization else None
        items.append(RecentActivityItem(
            id=v.id,
            tracking_code=v.tracking_code,
            candidate_name=candidate_name,
            organization_name=org_name,
            verification_type=v.verification_type,
            status=v.status,
            updated_at=v.updated_at,
            overall_confidence_score=v.overall_confidence_score,
            fraud_risk_score=v.fraud_risk_score or 0.0
        ))
    return items

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Returns role-tailored dashboard metrics and activity."""
    if current_user.role == UserRole.ADMIN:
        total_orgs = db.query(Organization).count()
        total_users = db.query(User).count()
        req_query = db.query(VerificationRequest)
        metrics = compute_metrics(req_query)
        recent = req_query.order_by(desc(VerificationRequest.updated_at)).limit(10).all()

        stats = AdminDashboardStats(
            total_organizations=total_orgs,
            total_users=total_users,
            metrics=metrics,
            recent_verifications=map_recent_activities(recent),
            system_health={
                "ocr_service_status": "ONLINE",
                "automation_engine": "READY",
                "database_mode": "ACTIVE",
                "active_queue_workers": 4
            }
        )
        return stats.model_dump()

    elif current_user.role == UserRole.ORG_HR:
        if not current_user.organization_id:
            raise HTTPException(status_code=400, detail="User is not assigned to an organization")
        
        org = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
        org_name = org.name if org else "Acme Corp"
        quota = org.verification_quota if org else 0
        
        req_query = db.query(VerificationRequest).filter(
            VerificationRequest.organization_id == current_user.organization_id
        )
        metrics = compute_metrics(req_query)
        recent = req_query.order_by(desc(VerificationRequest.updated_at)).limit(10).all()

        stats = HRDashboardStats(
            organization_id=current_user.organization_id,
            organization_name=org_name,
            quota_remaining=max(0, quota - metrics.total_verifications),
            metrics=metrics,
            recent_verifications=map_recent_activities(recent)
        )
        return stats.model_dump()

    else:  # CANDIDATE
        # Find candidate profile corresponding to user's email
        candidate = db.query(Candidate).filter(Candidate.email == current_user.email).first()
        if not candidate:
            return CandidateDashboardStats(
                candidate_id=current_user.id,
                candidate_name=current_user.full_name,
                assigned_verifications=[],
                action_required_count=0
            ).model_dump()

        assigned = db.query(VerificationRequest).filter(
            VerificationRequest.candidate_id == candidate.id
        ).order_by(desc(VerificationRequest.updated_at)).all()

        action_required = sum(
            1 for v in assigned if v.status in [VerificationStatus.CONSENT_PENDING, VerificationStatus.PENDING]
        )

        stats = CandidateDashboardStats(
            candidate_id=candidate.id,
            candidate_name=candidate.full_name,
            assigned_verifications=map_recent_activities(assigned),
            action_required_count=action_required
        )
        return stats.model_dump()

@router.get("/recent-activity", response_model=List[RecentActivityItem])
def get_recent_activity(
    status_filter: Optional[VerificationStatus] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(VerificationRequest)
    
    # Enforce data isolation
    if current_user.role == UserRole.ORG_HR:
        query = query.filter(VerificationRequest.organization_id == current_user.organization_id)
    elif current_user.role == UserRole.CANDIDATE:
        candidate = db.query(Candidate).filter(Candidate.email == current_user.email).first()
        if not candidate:
            return []
        query = query.filter(VerificationRequest.candidate_id == candidate.id)

    if status_filter:
        query = query.filter(VerificationRequest.status == status_filter)

    if search:
        search_pattern = f"%{search}%"
        query = query.join(Candidate).filter(
            (Candidate.full_name.ilike(search_pattern)) | 
            (Candidate.email.ilike(search_pattern)) |
            (VerificationRequest.tracking_code.ilike(search_pattern))
        )

    verifications = query.order_by(desc(VerificationRequest.updated_at)).offset(offset).limit(limit).all()
    return map_recent_activities(verifications)
