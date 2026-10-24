from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.entities import User, Organization, AuditLog
from app.models.enums import UserRole

router = APIRouter(prefix="/credits", tags=["Tokens & Billing"])

class PurchaseRequest(BaseModel):
    package_id: str
    tokens: int = Field(gt=0)
    amount_usd: float = Field(ge=0)

class DeductRequest(BaseModel):
    reason: str = "DOCUMENT_ANALYSIS"
    cost: int = Field(default=1, gt=0)

@router.get("/balance")
def get_credit_balance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve the current available token/credit balance for the user or organization."""
    if current_user.organization_id:
        org = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
        balance = org.verification_quota if org else 10
    else:
        balance = 10  # Individual candidate / unassigned user starting balance

    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "token_balance": balance,
        "cost_per_analysis": 1
    }

@router.post("/purchase")
def purchase_tokens(
    payload: PurchaseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Purchase a token package and credit the user's account."""
    if current_user.organization_id:
        org = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
        if org:
            org.verification_quota = (org.verification_quota or 0) + payload.tokens
            db.commit()
            db.refresh(org)
            new_balance = org.verification_quota
        else:
            new_balance = payload.tokens
    else:
        new_balance = 10 + payload.tokens

    # Create audit log for token purchase
    audit = AuditLog(
        actor_id=current_user.id,
        action="TOKEN_PURCHASE",
        resource_type="ORGANIZATION_QUOTA",
        resource_id=current_user.organization_id or current_user.id,
        details={
            "package_id": payload.package_id,
            "tokens_added": payload.tokens,
            "amount_paid_usd": payload.amount_usd,
            "new_balance": new_balance
        }
    )
    db.add(audit)
    db.commit()

    return {
        "success": True,
        "tokens_added": payload.tokens,
        "new_balance": new_balance,
        "message": f"Successfully purchased {payload.tokens} verification tokens!"
    }

@router.post("/deduct")
def deduct_token(
    payload: DeductRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Deduct tokens to analyze a document or initiate verification."""
    if current_user.organization_id:
        org = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
        current_balance = org.verification_quota if org else 0
        if current_balance < payload.cost:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Insufficient tokens. Please purchase more tokens to analyze documents."
            )
        if org:
            org.verification_quota -= payload.cost
            db.commit()
            remaining = org.verification_quota
        else:
            remaining = 0
    else:
        remaining = 5  # Fallback for candidate preview

    return {
        "success": True,
        "cost": payload.cost,
        "remaining_balance": remaining,
        "reason": payload.reason
    }
