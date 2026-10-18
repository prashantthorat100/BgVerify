from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class OrganizationBase(BaseModel):
    name: str
    slug: str
    domain: Optional[str] = None
    verification_quota: int = 1000

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    domain: Optional[str] = None
    verification_quota: Optional[int] = None
    is_active: Optional[bool] = None

class OrganizationResponse(OrganizationBase):
    id: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
