import re
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, record_audit
from app.core.security import verify_password, create_access_token, get_password_hash
from app.models.entities import User, Organization, Candidate
from app.models.enums import UserRole
from app.schemas.auth import Token, LoginRequest, UserCreate, UserResponse, RegisterResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    return re.sub(r'[\s_-]+', '-', text)

@router.post("/login", response_model=Token)
def login(
    login_data: LoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == login_data.email.lower()).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")

    org_name = user.organization.name if user.organization else None
    access_token = create_access_token(subject=user.id, role=user.role.value)

    record_audit(
        db=db,
        action="USER_LOGIN_SUCCESS",
        resource_type="USER",
        resource_id=user.id,
        actor=user,
        details={"email": user.email, "role": user.role.value},
        request=request
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        organization_id=user.organization_id,
        organization_name=org_name
    )

@router.post("/token", response_model=Token)
def login_for_swagger_docs(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """OAuth2 password flow compatibility for Swagger UI /docs authorization button"""
    user = db.query(User).filter(User.email == form_data.username.lower()).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    org_name = user.organization.name if user.organization else None
    access_token = create_access_token(subject=user.id, role=user.role.value)
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        organization_id=user.organization_id,
        organization_name=org_name
    )

@router.get("/me", response_model=Token)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    org_name = current_user.organization.name if current_user.organization else None
    token = create_access_token(subject=current_user.id, role=current_user.role.value)
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        organization_id=current_user.organization_id,
        organization_name=org_name
    )

@router.post("/register", response_model=RegisterResponse)
def register(
    data: UserCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An account with this email already exists")

    org_id = data.organization_id
    org_name = None

    # Handle Organization creation/lookup for ORG_HR
    if data.role == UserRole.ORG_HR:
        company_name = data.organization_name or "My Enterprise"
        company_slug = slugify(company_name)
        existing_org = db.query(Organization).filter(
            (Organization.slug == company_slug) | (Organization.name == company_name)
        ).first()

        if existing_org:
            org_id = existing_org.id
            org_name = existing_org.name
        else:
            new_org = Organization(
                name=company_name,
                slug=company_slug,
                verification_quota=100
            )
            db.add(new_org)
            db.flush()
            org_id = new_org.id
            org_name = new_org.name

    # Handle Candidate profile auto-creation for CANDIDATE
    elif data.role == UserRole.CANDIDATE:
        cand_existing = db.query(Candidate).filter(Candidate.email == data.email.lower()).first()
        if not cand_existing:
            cand = Candidate(
                email=data.email.lower(),
                full_name=data.full_name,
                phone=data.phone,
                provided_details={}
            )
            db.add(cand)
            db.flush()

    user = User(
        email=data.email.lower(),
        hashed_password=get_password_hash(data.password),
        full_name=data.full_name,
        role=data.role,
        organization_id=org_id,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    record_audit(
        db=db,
        action="USER_REGISTRATION",
        resource_type="USER",
        resource_id=user.id,
        actor=user,
        details={"role": user.role.value, "organization": org_name},
        request=request
    )

    token_str = create_access_token(subject=user.id, role=user.role.value)
    token_obj = Token(
        access_token=token_str,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        organization_id=user.organization_id,
        organization_name=org_name
    )

    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        organization_id=user.organization_id,
        is_active=user.is_active
    )

    return RegisterResponse(user=user_resp, token=token_obj)
