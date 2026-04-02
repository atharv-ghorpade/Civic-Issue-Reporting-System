from sqlalchemy.orm import Session
from app.models.notification import Notification

class NotificationService:
    @staticmethod
    def create_notification(db: Session, user_id: int, title: str, message: str):
        db_notification = Notification(
            user_id=user_id,
            title=title,
            message=message
        )
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        return db_notification

    @staticmethod
    def get_notifications(db: Session, user_id: int, limit: int = 50):
        return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).limit(limit).all()

notification_service = NotificationService()
