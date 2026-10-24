import sys
import os
from datetime import datetime, timezone, timedelta

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.entities import (
    Organization, User, Candidate, VerificationRequest, VerificationStateHistory,
    ConsentRecord, FieldComparisonResult, ExtractedField, Document, AuditLog
)
from app.models.enums import (
    UserRole, VerificationType, VerificationStatus, MatchStatus, EvidenceSourceType
)

def seed():
    # Create tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).filter(User.email == "admin@bgverify.ai").first():
            print("Database already contains seed users. Skipping.")
            return

        print("Seeding database with synthetic demo data...")
        now = datetime.now(timezone.utc)

        # 1. Organizations
        org_acme = Organization(
            name="Acme Global Corporation",
            slug="acme-global",
            domain="acme-corp.com",
            verification_quota=500
        )
        org_apex = Organization(
            name="Apex FinTech Labs",
            slug="apex-fintech",
            domain="apexfintech.com",
            verification_quota=250
        )
        db.add_all([org_acme, org_apex])
        db.flush()

        # 2. Users
        admin_user = User(
            email="admin@bgverify.ai",
            hashed_password=get_password_hash("AdminPass123!"),
            full_name="Alex Administrator",
            role=UserRole.ADMIN,
            is_active=True
        )
        hr_user = User(
            email="hr@acme-corp.com",
            hashed_password=get_password_hash("HrPass123!"),
            full_name="Helen HR Manager",
            role=UserRole.ORG_HR,
            organization_id=org_acme.id,
            is_active=True
        )
        candidate_user = User(
            email="candidate@example.com",
            hashed_password=get_password_hash("CandidatePass123!"),
            full_name="John Doe",
            role=UserRole.CANDIDATE,
            is_active=True
        )
        candidate_user_2 = User(
            email="sarah.jenkins@example.com",
            hashed_password=get_password_hash("CandidatePass123!"),
            full_name="Sarah Jenkins",
            role=UserRole.CANDIDATE,
            is_active=True
        )
        db.add_all([admin_user, hr_user, candidate_user, candidate_user_2])
        db.flush()

        # 3. Candidates
        cand_john = Candidate(
            full_name="John Doe",
            email="candidate@example.com",
            phone="+1 (555) 234-5678",
            date_of_birth="1995-08-14",
            provided_details={
                "institution": "Stanford University",
                "degree": "Bachelor of Science in Computer Science",
                "graduation_year": "2017",
                "gpa": "3.85"
            }
        )
        cand_sarah = Candidate(
            full_name="Sarah Jenkins",
            email="sarah.jenkins@example.com",
            phone="+1 (555) 987-6543",
            date_of_birth="1992-04-22",
            provided_details={
                "employer": "TechCorp Global",
                "title": "Lead Backend Engineer",
                "start_date": "2020-01-15",
                "end_date": "2023-11-30"
            }
        )
        cand_michael = Candidate(
            full_name="Michael Chang",
            email="michael.chang@example.com",
            phone="+1 (555) 345-6789",
            date_of_birth="1998-11-03",
            provided_details={
                "id_type": "Passport",
                "id_number": "P89421035",
                "country": "United States"
            }
        )
        db.add_all([cand_john, cand_sarah, cand_michael])
        db.flush()

        # 4. Verifications
        # Verification 1: COMPLETED (Education)
        verif_1 = VerificationRequest(
            tracking_code="BGV-EDU-2026-901",
            organization_id=org_acme.id,
            candidate_id=cand_john.id,
            verification_type=VerificationType.EDUCATION,
            status=VerificationStatus.COMPLETED,
            candidate_consent_given=True,
            overall_confidence_score=0.98,
            fraud_risk_score=0.02,
            notes="Stanford B.S. degree verified against institutional records and academic transcript."
        )
        # Verification 2: MANUAL_REVIEW (Employment discrepancy)
        verif_2 = VerificationRequest(
            tracking_code="BGV-EMP-2026-442",
            organization_id=org_acme.id,
            candidate_id=cand_sarah.id,
            verification_type=VerificationType.EMPLOYMENT,
            status=VerificationStatus.MANUAL_REVIEW,
            candidate_consent_given=True,
            overall_confidence_score=0.74,
            fraud_risk_score=0.45,
            fraud_signals=["Employment end date discrepancy of 6 months detected between candidate form and payroll letter"],
            notes="Requires manual confirmation with HR payroll contact."
        )
        # Verification 3: CONSENT_PENDING (Identity)
        verif_3 = VerificationRequest(
            tracking_code="BGV-ID-2026-118",
            organization_id=org_acme.id,
            candidate_id=cand_michael.id,
            verification_type=VerificationType.IDENTITY,
            status=VerificationStatus.CONSENT_PENDING,
            candidate_consent_given=False,
            overall_confidence_score=None,
            notes="Invitation link sent to candidate for identity document upload and biometric consent."
        )
        db.add_all([verif_1, verif_2, verif_3])
        db.flush()

        # 5. Consents
        consent_1 = ConsentRecord(
            verification_request_id=verif_1.id,
            candidate_id=cand_john.id,
            consent_given=True,
            consent_statement="I hereby authorize Acme Global Corporation and BGVerify.ai to verify my academic credentials.",
            ip_address="192.168.1.105"
        )
        consent_2 = ConsentRecord(
            verification_request_id=verif_2.id,
            candidate_id=cand_sarah.id,
            consent_given=True,
            consent_statement="I agree to background verification of my previous employment history.",
            ip_address="192.168.1.112"
        )
        db.add_all([consent_1, consent_2])

        # 6. Comparisons for Verif 1
        comp_1 = FieldComparisonResult(
            verification_request_id=verif_1.id,
            field_name="institution_name",
            candidate_value="Stanford University",
            evidence_value="Stanford University, CA",
            match_status=MatchStatus.MATCH,
            confidence_score=0.99,
            explanation="Exact semantic match verified against accredited higher education registry.",
            evidence_source="National Student Clearinghouse / Registrar API"
        )
        comp_2 = FieldComparisonResult(
            verification_request_id=verif_1.id,
            field_name="degree_awarded",
            candidate_value="Bachelor of Science in Computer Science",
            evidence_value="B.S. Computer Science",
            match_status=MatchStatus.MATCH,
            confidence_score=0.97,
            explanation="Degree title normalized and matched official conferral record.",
            evidence_source="Official Academic Transcript OCR"
        )
        db.add_all([comp_1, comp_2])

        # 7. Comparisons for Verif 2 (Discrepancy)
        comp_3 = FieldComparisonResult(
            verification_request_id=verif_2.id,
            field_name="employer_name",
            candidate_value="TechCorp Global",
            evidence_value="TechCorp Global LLC",
            match_status=MatchStatus.MATCH,
            confidence_score=0.95,
            explanation="Entity name matched with legal suffix variation.",
            evidence_source="Workforce Verification Network"
        )
        comp_4 = FieldComparisonResult(
            verification_request_id=verif_2.id,
            field_name="end_date",
            candidate_value="2023-11-30",
            evidence_value="2023-05-15",
            match_status=MatchStatus.MANUAL_REVIEW,
            confidence_score=0.52,
            explanation="Candidate reported end date is 6 months later than corporate payroll separation record.",
            evidence_source="Corporate HR Verification Record"
        )
        db.add_all([comp_3, comp_4])

        # 8. Audit logs
        audit_1 = AuditLog(
            actor_id=admin_user.id,
            actor_email=admin_user.email,
            actor_role="ADMIN",
            action="SYSTEM_INITIALIZED",
            resource_type="SYSTEM",
            resource_id="ROOT",
            details={"version": "1.0.0"}
        )
        audit_2 = AuditLog(
            actor_id=hr_user.id,
            actor_email=hr_user.email,
            actor_role="ORG_HR",
            action="VERIFICATION_REQUEST_CREATED",
            resource_type="VERIFICATION_REQUEST",
            resource_id=verif_1.id,
            details={"tracking_code": verif_1.tracking_code}
        )
        db.add_all([audit_1, audit_2])

        db.commit()
        print("Successfully seeded synthetic demo data!")
        print("Admin user:     admin@bgverify.ai / AdminPass123!")
        print("HR user:        hr@acme-corp.com / HrPass123!")
        print("Candidate user: candidate@example.com / CandidatePass123!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()
