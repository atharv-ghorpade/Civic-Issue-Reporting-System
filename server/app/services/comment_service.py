from sqlalchemy.orm import Session
from app.models.comment import Comment as CommentModel
from app.schemas.comment_schema import CommentCreate

class CommentService:
    @staticmethod
    def get_comments(db: Session, issue_id: int):
        return db.query(CommentModel).filter(CommentModel.issue_id == issue_id).order_by(CommentModel.created_at.asc()).all()

    @staticmethod
    def create_comment(db: Session, comment: CommentCreate, user_id: int):
        db_comment = CommentModel(
            **comment.model_dump(),
            user_id=user_id
        )
        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        
        # NOTIFICATION
        # Notify issue owner if someone else commented
        from app.models.issue import Issue as IssueModel
        issue = db.query(IssueModel).filter(IssueModel.id == db_comment.issue_id).first()
        if issue and issue.user_id != user_id:
            from app.services.notification_service import notification_service
            # Check roles if specific "Admin" notification is needed
            from app.models.user import User as UserModel
            commenter = db.query(UserModel).filter(UserModel.id == user_id).first()
            role_text = "Management" if commenter.role in ["admin", "authority"] else "User"
            
            notification_service.create_notification(
                db, 
                user_id=issue.user_id, 
                title=f"New Comment from {role_text}", 
                message=f"Someone commented on your issue '{issue.title}'."
            )
            
        return db_comment

comment_service = CommentService()
