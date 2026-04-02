from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.issue import Issue as IssueModel
from app.models.status_history import StatusHistory as StatusHistoryModel
from app.schemas.issue_schema import IssueCreate, IssueUpdate

class IssueService:
    @staticmethod
    def get_issues(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        status: Optional[str] = None,
        category: Optional[str] = None,
        priority: Optional[str] = None,
        search: Optional[str] = None,
        user_id: Optional[int] = None
    ):
        query = db.query(IssueModel)
        
        if status:
            query = query.filter(IssueModel.status == status)
        if category:
            query = query.filter(IssueModel.category == category)
        if priority:
            query = query.filter(IssueModel.priority == priority)
        if user_id:
            query = query.filter(IssueModel.user_id == user_id)
        if search:
            query = query.filter(
                or_(
                    IssueModel.title.ilike(f"%{search}%"),
                    IssueModel.description.ilike(f"%{search}%")
                )
            )
            
        return query.order_by(IssueModel.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_issue(db: Session, issue_id: int):
        return db.query(IssueModel).filter(IssueModel.id == issue_id).first()

    @staticmethod
    def create_issue(db: Session, issue: IssueCreate, user_id: int):
        db_issue = IssueModel(
            **issue.model_dump(),
            user_id=user_id
        )
        db.add(db_issue)
        db.commit()
        db.refresh(db_issue)
        
        # Initial history entry
        history = StatusHistoryModel(
            issue_id=db_issue.id,
            new_status=db_issue.status,
            changed_by_user_id=user_id
        )
        db.add(history)
        db.commit()
        
        return db_issue

    @staticmethod
    def update_issue(db: Session, db_issue: IssueModel, issue_in: IssueUpdate, changed_by_id: int):
        update_data = issue_in.model_dump(exclude_unset=True)
        
        # Handle status history if status is changing
        if "status" in update_data and update_data["status"] != db_issue.status:
            old_status = db_issue.status
            new_status = update_data["status"]
            
            history = StatusHistoryModel(
                issue_id=db_issue.id,
                old_status=old_status,
                new_status=new_status,
                changed_by_user_id=changed_by_id
            )
            db.add(history)
            
            # NOTIFICATION
            from app.services.notification_service import notification_service
            notification_service.create_notification(
                db, 
                user_id=db_issue.user_id, 
                title="Issue Status Updated", 
                message=f"Your issue '{db_issue.title}' status changed from '{old_status}' to '{new_status}'."
            )
        
        for field in update_data:
            setattr(db_issue, field, update_data[field])
            
        db.add(db_issue)
        db.commit()
        db.refresh(db_issue)
        return db_issue

    @staticmethod
    def delete_issue(db: Session, issue_id: int):
        db_issue = db.query(IssueModel).filter(IssueModel.id == issue_id).first()
        if db_issue:
            db.delete(db_issue)
            db.commit()
        return db_issue

    @staticmethod
    def get_status_history(db: Session, issue_id: int):
        return db.query(StatusHistoryModel).filter(StatusHistoryModel.issue_id == issue_id).order_by(StatusHistoryModel.changed_at.desc()).all()

    @staticmethod
    def get_admin_stats(db: Session):
        total_issues = db.query(IssueModel).count()
        open_issues = db.query(IssueModel).filter(IssueModel.status == "open").count()
        in_progress = db.query(IssueModel).filter(IssueModel.status == "in-progress").count()
        resolved = db.query(IssueModel).filter(IssueModel.status == "resolved").count()
        
        return {
            "total": total_issues,
            "open": open_issues,
            "in_progress": in_progress,
            "resolved": resolved
        }

issue_service = IssueService()
