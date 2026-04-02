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
        from app.services.notification_service import notification_service
        from app.models.user import User as UserModel
        
        update_data = issue_in.model_dump(exclude_unset=True)
        
        # 1. NOTIFICATION FOR ASSIGNMENT
        if "assigned_to_id" in update_data and update_data["assigned_to_id"] != db_issue.assigned_to_id:
            new_authority_id = update_data["assigned_to_id"]
            if new_authority_id:
                notification_service.create_notification(
                    db,
                    user_id=new_authority_id,
                    title="New Issue Assigned",
                    message=f"Admin has assigned you a new issue: '{db_issue.title}'."
                )

        # 2. NOTIFICATION & COMMENT FOR RESOLUTION
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
            
            # Notify owner regardless of status change
            notification_service.create_notification(
                db, 
                user_id=db_issue.user_id, 
                title="Issue Status Updated", 
                message=f"Your issue '{db_issue.title}' status changed from '{old_status}' to '{new_status}'."
            )
            
            # If resolved by authority, notify admins and add a comment
            if new_status == "resolved":
                solver = db.query(UserModel).filter(UserModel.id == changed_by_id).first()
                if solver and solver.role in ["authority", "admin"]:
                    # Notify Admins
                    admins = db.query(UserModel).filter(UserModel.role == "admin").all()
                    for admin in admins:
                        if admin.id != changed_by_id: # Don't notify the one who resolved it
                            notification_service.create_notification(
                                db,
                                user_id=admin.id,
                                title=f"Issue Resolved by {solver.role.capitalize()}",
                                message=f"Issue '{db_issue.title}' has been marked as resolved by {solver.full_name}."
                            )
                    
                    # Add comment automatically
                    from app.models.comment import Comment as CommentModel
                    res_comment = CommentModel(
                        issue_id=db_issue.id,
                        user_id=changed_by_id,
                        content=f"✅ AUTOMATED: This issue was marked as RESOLVED by {solver.role.capitalize()} ({solver.full_name})."
                    )
                    db.add(res_comment)
        
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
