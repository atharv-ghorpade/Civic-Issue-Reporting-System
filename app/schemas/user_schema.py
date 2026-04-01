from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict

# Shared properties
class UserBase(BaseModel):
    id: Optional[int] = None
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    is_active: Optional[bool] = True
    role: Optional[str] = "citizen"
    full_name: Optional[str] = None
    is_verified: Optional[bool] = False

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str
    username: str
    role: Optional[str] = "citizen"

# Properties to return via API
class User(UserBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
