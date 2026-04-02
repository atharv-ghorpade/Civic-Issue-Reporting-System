from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.routers.deps import get_db, get_current_active_admin
from app.services.issue_service import issue_service
from app.schemas.user_schema import User
from app.models.user import User as UserModel
from typing import List

router = APIRouter()

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_admin: UserModel = Depends(get_current_active_admin)
):
    """View dashboard stats (Admin only)"""
    return issue_service.get_admin_stats(db)

@router.get("/users", response_model=List[User])
def read_all_users(
    db: Session = Depends(get_db),
    current_admin: UserModel = Depends(get_current_active_admin)
):
    """View all users (Admin only)"""
    return db.query(UserModel).all()

@router.put("/users/{user_id}/verify", response_model=User)
def verify_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: UserModel = Depends(get_current_active_admin)
):
    """Verify a user (Admin only)"""
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_verified = True
    db.commit()
    db.refresh(user)
    return user
