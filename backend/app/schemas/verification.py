from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.enums import (
    VerificationType, VerificationStatus, MatchStatus, ReviewDecision, EvidenceSourceType
)

class CandidateCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    provided_details: Optional[Dict[str, Any]] = None

class CandidateResponse(BaseModel):
    id: str
    full_name: str
    email: str
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    provided_details: Dict[str, Any] = {}

    model_config = ConfigDict(from_attributes=True)

class VerificationRequestCreate(BaseModel):
    candidate: CandidateCreate
    verification_type: VerificationType
    notes: Optional[str] = None

class VerificationRequestUpdate(BaseModel):
    status: Optional[VerificationStatus] = None
    notes: Optional[str] = None

class ExtractedFieldResponse(BaseModel):
    id: str
    field_name: str
    raw_value: Optional[str] = None
    normalized_value: Optional[str] = None
    confidence_score: float
    is_corrected: bool
    corrected_value: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class DocumentResponse(BaseModel):
    id: str
    file_name: str
    file_type: str
    file_size_bytes: int
    upload_status: str
    sha256_hash: str
    created_at: datetime
    extracted_fields: List[ExtractedFieldResponse] = []

    model_config = ConfigDict(from_attributes=True)

class FieldComparisonResponse(BaseModel):
    id: str
    field_name: str
    candidate_value: Optional[str] = None
    evidence_value: Optional[str] = None
    match_status: MatchStatus
    confidence_score: float
    explanation: str
    evidence_source: str

    model_config = ConfigDict(from_attributes=True)

class ManualReviewCreate(BaseModel):
    decision: ReviewDecision
    decision_reason: str
    notes: Optional[str] = None

class ManualReviewResponse(BaseModel):
    id: str
    reviewer_id: Optional[str] = None
    reviewer_name: Optional[str] = None
    decision: ReviewDecision
    decision_reason: str
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ConsentRecordResponse(BaseModel):
    id: str
    consent_given: bool
    consent_statement: str
    timestamp: datetime
    ip_address: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class VerificationRequestResponse(BaseModel):
    id: str
    tracking_code: str
    organization_id: str
    candidate_id: str
    candidate_name: str
    candidate_email: str
    verification_type: VerificationType
    status: VerificationStatus
    candidate_consent_given: bool
    overall_confidence_score: Optional[float] = None
    fraud_risk_score: float = 0.0
    fraud_signals: List[Any] = []
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    documents: List[DocumentResponse] = []
    field_comparisons: List[FieldComparisonResponse] = []
    manual_reviews: List[ManualReviewResponse] = []
    consent_record: Optional[ConsentRecordResponse] = None

    model_config = ConfigDict(from_attributes=True)
