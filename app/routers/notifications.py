from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.routers.deps import get_db, get_current_active_user
from app.services.notification_service import notification_service
from app.models.user import User as UserModel
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class NotificationSchema(BaseModel):
    id: int
    title: str
    message: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[NotificationSchema])
def get_my_notifications(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """View all notifications for the current user"""
    return notification_service.get_notifications(db, current_user.id)
