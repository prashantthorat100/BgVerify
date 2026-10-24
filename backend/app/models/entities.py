import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Boolean, Integer, Float, DateTime, ForeignKey, Text, Enum as SQLEnum, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.enums import (
    UserRole, VerificationType, VerificationStatus, MatchStatus, ReviewDecision, EvidenceSourceType
)

def generate_uuid() -> str:
    return str(uuid.uuid4())

def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, unique=True, index=True)
    slug = Column(String(255), nullable=False, unique=True, index=True)
    domain = Column(String(255), nullable=True)
    verification_quota = Column(Integer, default=1000)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    verifications = relationship("VerificationRequest", back_populates="organization", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), nullable=False, unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.ORG_HR, nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    organization = relationship("Organization", back_populates="users")
    reviews_conducted = relationship("ManualReview", back_populates="reviewer")
    audit_logs = relationship("AuditLog", back_populates="actor")


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    date_of_birth = Column(String(50), nullable=True)
    provided_details = Column(JSON, default=dict)  # Candidate self-reported facts: degree, institution, employer, dates, etc.
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    verifications = relationship("VerificationRequest", back_populates="candidate", cascade="all, delete-orphan")


class VerificationRequest(Base):
    __tablename__ = "verification_requests"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tracking_code = Column(String(64), unique=True, index=True, nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    candidate_id = Column(String(36), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    verification_type = Column(SQLEnum(VerificationType), nullable=False, index=True)
    status = Column(SQLEnum(VerificationStatus), default=VerificationStatus.CREATED, nullable=False, index=True)
    
    # Metadata & Config
    candidate_consent_given = Column(Boolean, default=False)
    overall_confidence_score = Column(Float, nullable=True)
    fraud_risk_score = Column(Float, default=0.0)
    fraud_signals = Column(JSON, default=list)  # List of anomaly descriptors
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    # Relationships
    organization = relationship("Organization", back_populates="verifications")
    candidate = relationship("Candidate", back_populates="verifications")
    consent_record = relationship("ConsentRecord", back_populates="verification", uselist=False, cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="verification", cascade="all, delete-orphan")
    evidence_records = relationship("EvidenceRecord", back_populates="verification", cascade="all, delete-orphan")
    field_comparisons = relationship("FieldComparisonResult", back_populates="verification", cascade="all, delete-orphan")
    state_history = relationship("VerificationStateHistory", back_populates="verification", cascade="all, delete-orphan")
    manual_reviews = relationship("ManualReview", back_populates="verification", cascade="all, delete-orphan")


class VerificationStateHistory(Base):
    __tablename__ = "verification_state_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    verification_request_id = Column(String(36), ForeignKey("verification_requests.id", ondelete="CASCADE"), nullable=False, index=True)
    from_status = Column(String(50), nullable=True)
    to_status = Column(String(50), nullable=False)
    reason = Column(String(255), nullable=True)
    actor_id = Column(String(36), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    verification = relationship("VerificationRequest", back_populates="state_history")


class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    verification_request_id = Column(String(36), ForeignKey("verification_requests.id", ondelete="CASCADE"), unique=True, nullable=False)
    candidate_id = Column(String(36), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    consent_given = Column(Boolean, default=True, nullable=False)
    consent_statement = Column(Text, nullable=False)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(255), nullable=True)
    timestamp = Column(DateTime(timezone=True), default=get_utc_now)

    verification = relationship("VerificationRequest", back_populates="consent_record")


class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    verification_request_id = Column(String(36), ForeignKey("verification_requests.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    storage_path = Column(String(512), nullable=False)
    sha256_hash = Column(String(64), nullable=False)
    upload_status = Column(String(50), default="PROCESSED")
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    verification = relationship("VerificationRequest", back_populates="documents")
    extracted_fields = relationship("ExtractedField", back_populates="document", cascade="all, delete-orphan")


class ExtractedField(Base):
    __tablename__ = "extracted_fields"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    field_name = Column(String(100), nullable=False, index=True)
    raw_value = Column(Text, nullable=True)
    normalized_value = Column(Text, nullable=True)
    confidence_score = Column(Float, default=1.0)
    is_corrected = Column(Boolean, default=False)
    corrected_value = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    document = relationship("Document", back_populates="extracted_fields")


class EvidenceRecord(Base):
    __tablename__ = "evidence_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    verification_request_id = Column(String(36), ForeignKey("verification_requests.id", ondelete="CASCADE"), nullable=False, index=True)
    source_type = Column(SQLEnum(EvidenceSourceType), nullable=False)
    source_name = Column(String(255), nullable=False)  # e.g., "National University Registry Portal", "Payroll API"
    evidence_payload = Column(JSON, default=dict)
    provenance_hash = Column(String(64), nullable=True)
    timestamp = Column(DateTime(timezone=True), default=get_utc_now)

    verification = relationship("VerificationRequest", back_populates="evidence_records")


class FieldComparisonResult(Base):
    __tablename__ = "field_comparison_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    verification_request_id = Column(String(36), ForeignKey("verification_requests.id", ondelete="CASCADE"), nullable=False, index=True)
    field_name = Column(String(100), nullable=False)
    candidate_value = Column(Text, nullable=True)
    evidence_value = Column(Text, nullable=True)
    match_status = Column(SQLEnum(MatchStatus), nullable=False)
    confidence_score = Column(Float, default=1.0)
    explanation = Column(Text, nullable=False)
    evidence_source = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    verification = relationship("VerificationRequest", back_populates="field_comparisons")


class ManualReview(Base):
    __tablename__ = "manual_reviews"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    verification_request_id = Column(String(36), ForeignKey("verification_requests.id", ondelete="CASCADE"), nullable=False, index=True)
    reviewer_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    decision = Column(SQLEnum(ReviewDecision), nullable=False)
    decision_reason = Column(Text, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    verification = relationship("VerificationRequest", back_populates="manual_reviews")
    reviewer = relationship("User", back_populates="reviews_conducted")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    actor_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    actor_email = Column(String(255), nullable=True)
    actor_role = Column(String(50), nullable=True)
    action = Column(String(100), nullable=False, index=True)
    resource_type = Column(String(100), nullable=False, index=True)
    resource_id = Column(String(100), nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, index=True)

    actor = relationship("User", back_populates="audit_logs")
