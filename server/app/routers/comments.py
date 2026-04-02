from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.comment_schema import Comment, CommentCreate
from typing import List

router = APIRouter()

@router.get("/{issue_id}", response_model=List[Comment])
def read_comments(issue_id: int, db: Session = Depends(get_db)):
    return []

@router.post("/", response_model=Comment)
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    return {"message": "placeholder"}
