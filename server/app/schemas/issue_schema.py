from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class IssueImage(BaseModel):
    id: int
    image_url: str
    
    model_config = ConfigDict(from_attributes=True)

class IssueBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = "open"
    category: Optional[str] = None
    priority: Optional[str] = "medium"

class IssueCreate(IssueBase):
    title: str
    description: str
    location: str
    category: str

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    assigned_to_id: Optional[int] = None

class StatusUpdate(BaseModel):
    status: str

class IssueStatusHistory(BaseModel):
    id: int
    old_status: Optional[str] = None
    new_status: str
    changed_at: datetime
    changed_by_user_id: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)

class Issue(IssueBase):
    id: int
    user_id: int
    assigned_to_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    images: List[IssueImage] = []
    
    model_config = ConfigDict(from_attributes=True)
