from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base, engine

# ------------------ USER TABLE ------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String(20), default="citizen")
    is_verified = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    issues = relationship("Issue", back_populates="user")


# ------------------ ISSUE TABLE ------------------
class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100))
    priority = Column(String(50))
    status = Column(String(50), default="open")

    user_id = Column(Integer, ForeignKey("users.id"))
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user = relationship("User", foreign_keys=[user_id])
    comments = relationship("Comment", back_populates="issue")


# ------------------ COMMENTS TABLE ------------------
class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"))
    issue_id = Column(Integer, ForeignKey("issues.id"))

    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    issue = relationship("Issue", back_populates="comments")


# ------------------ STATUS HISTORY ------------------
class StatusHistory(Base):
    __tablename__ = "status_history"

    id = Column(Integer, primary_key=True)
    issue_id = Column(Integer, ForeignKey("issues.id"))
    old_status = Column(String(50))
    new_status = Column(String(50))
    changed_at = Column(TIMESTAMP, default=datetime.utcnow)


# ------------------ ISSUE IMAGES ------------------
class IssueImage(Base):
    __tablename__ = "issue_images"

    id = Column(Integer, primary_key=True)
    issue_id = Column(Integer, ForeignKey("issues.id"))
    image_url = Column(Text, nullable=False)


# ------------------ NOTIFICATIONS ------------------
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


# ------------------ CREATE TABLES ------------------
def create_tables():
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")


if __name__ == "__main__":
    create_tables()