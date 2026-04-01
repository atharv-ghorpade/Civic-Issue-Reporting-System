from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.routers.deps import get_db, get_current_active_user
from app.schemas.user_schema import User
from typing import List

router = APIRouter()

@router.get("/me", response_model=User)
def read_user_me(
    current_user: User = Depends(get_current_active_user),
):
    return current_user
