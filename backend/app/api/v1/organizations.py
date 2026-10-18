from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_role, record_audit
from app.models.entities import User, Organization
from app.models.enums import UserRole
from app.schemas.organization import OrganizationCreate, OrganizationResponse, OrganizationUpdate

router = APIRouter(prefix="/organizations", tags=["Organizations"])

@router.get("/", response_model=List[OrganizationResponse])
def list_organizations(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    return db.query(Organization).order_by(Organization.created_at.desc()).all()

@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
def create_organization(
    data: OrganizationCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    existing = db.query(Organization).filter(
        (Organization.name == data.name) | (Organization.slug == data.slug)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Organization with this name or slug already exists")
    
    org = Organization(
        name=data.name,
        slug=data.slug,
        domain=data.domain,
        verification_quota=data.verification_quota
    )
    db.add(org)
    db.commit()
    db.refresh(org)

    record_audit(
        db=db,
        action="ORGANIZATION_CREATED",
        resource_type="ORGANIZATION",
        resource_id=org.id,
        actor=current_user,
        details={"name": org.name, "slug": org.slug},
        request=request
    )
    return org

@router.get("/{org_id}", response_model=OrganizationResponse)
def get_organization(
    org_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Admin can view any, Org HR can only view their own organization
    if current_user.role != UserRole.ADMIN and current_user.organization_id != org_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied for this organization")

    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org
