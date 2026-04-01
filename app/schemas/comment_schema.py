from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CommentBase(BaseModel):
    content: Optional[str] = None
    issue_id: Optional[int] = None

class CommentCreate(CommentBase):
    content: str
    issue_id: int

class Comment(CommentBase):
    id: int
    user_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
    
class CommentDetailed(Comment):
    username: str
    avatar_url: Optional[str] = None
