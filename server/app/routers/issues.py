from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from app.routers.deps import get_db, get_current_active_user
from app.schemas.issue_schema import Issue, IssueCreate, IssueUpdate, StatusUpdate, IssueStatusHistory
from app.services.issue_service import issue_service
from app.models.user import User as UserModel
import os
import uuid

router = APIRouter()

@router.get("/", response_model=List[Issue])
def read_issues(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    """View all issues with filtering and search"""
    return issue_service.get_issues(
        db, skip=skip, limit=limit, status=status, category=category, priority=priority, search=search
    )

from fastapi import Form, File, UploadFile

@router.post("/", response_model=Issue)
async def create_issue(
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    category: str = Form(...),
    priority: str = Form("medium"),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Create a new issue with optional image upload"""
    issue_in = IssueCreate(
        title=title, 
        description=description, 
        location=location, 
        category=category,
        priority=priority
    )
    db_issue = issue_service.create_issue(db, issue_in, current_user.id)
    
    if image:
        # Re-use the existing logic or move to service
        upload_dir = "uploads"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
            
        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        with open(file_path, "wb") as f:
            content = await image.read()
            f.write(content)
            
        from app.models.issue_image import IssueImage as ImageModel
        new_image = ImageModel(issue_id=db_issue.id, image_url=f"/uploads/{unique_filename}")
        db.add(new_image)
        db.commit()
        db.refresh(db_issue)
        
    return db_issue

@router.get("/{id}", response_model=Issue)
def read_single_issue(
    id: int,
    db: Session = Depends(get_db)
):
    """View a single issue"""
    db_issue = issue_service.get_issue(db, id)
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return db_issue

@router.put("/{id}", response_model=Issue)
def update_issue(
    id: int,
    issue_in: IssueUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Update issue (only owner/admin)"""
    db_issue = issue_service.get_issue(db, id)
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    if db_issue.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return issue_service.update_issue(db, db_issue, issue_in, current_user.id)

@router.delete("/{id}", response_model=Issue)
def delete_issue(
    id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Delete issue (only owner/admin)"""
    db_issue = issue_service.get_issue(db, id)
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    if db_issue.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return issue_service.delete_issue(db, id)

@router.put("/{id}/status", response_model=Issue)
def update_issue_status(
    id: int,
    status_in: StatusUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Change issue status (Admin/Authority only?)"""
    db_issue = issue_service.get_issue(db, id)
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    # For DBMS project, maybe authorities can also change status
    if current_user.role not in ["admin", "authority"] and db_issue.user_id != current_user.id:
         raise HTTPException(status_code=403, detail="Not enough permissions")
         
    return issue_service.update_issue(db, db_issue, IssueUpdate(status=status_in.status), current_user.id)

@router.get("/{id}/history", response_model=List[IssueStatusHistory])
def get_issue_history(
    id: int,
    db: Session = Depends(get_db)
):
    """View status history of an issue"""
    return issue_service.get_status_history(db, id)

# --- Comments ---
from app.schemas.comment_schema import Comment, CommentCreate
from app.services.comment_service import comment_service

@router.get("/{id}/comments", response_model=List[Comment])
def read_issue_comments(
    id: int,
    db: Session = Depends(get_db)
):
    """View comments of an issue"""
    return comment_service.get_comments(db, id)

@router.post("/{id}/comments", response_model=Comment)
def create_issue_comment(
    id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Add comment to issue"""
    # Force the issue_id to the one in the path
    comment.issue_id = id
    return comment_service.create_comment(db, comment, current_user.id)

# --- Administration & Assignment ---
from app.routers.deps import get_current_active_admin

@router.put("/{id}/assign", response_model=Issue)
def assign_issue(
    id: int,
    assigned_to_id: int,
    db: Session = Depends(get_db),
    current_admin: UserModel = Depends(get_current_active_admin)
):
    """Assign issue to authority (Admin only)"""
    db_issue = issue_service.get_issue(db, id)
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
        
    # Check if the user to assign to actually exists and is an authority?
    authority = db.query(UserModel).filter(UserModel.id == assigned_to_id).first()
    if not authority:
        raise HTTPException(status_code=404, detail="Authority user not found")
        
    return issue_service.update_issue(db, db_issue, IssueUpdate(assigned_to_id=assigned_to_id), current_admin.id)

# --- Images ---
@router.post("/{id}/images")
async def upload_issue_image(
    id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Upload images with issue"""
    db_issue = issue_service.get_issue(db, id)
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    # Check ownership
    if db_issue.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permission denied")
        
    # For this project, we'll simulate upload by saving to a local 'uploads' dir
    # and returning a mock URL or local path.
    # In a real app we'd use S3/Cloudinary.
    
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
        
    # Store record in DB
    from app.models.issue_image import IssueImage as ImageModel
    image = ImageModel(issue_id=id, image_url=f"/uploads/{unique_filename}")
    db.add(image)
    db.commit()
    db.refresh(image)
    
    return {"id": image.id, "image_url": image.image_url}
