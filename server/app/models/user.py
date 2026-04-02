from sqlalchemy import Boolean, Column, Integer, String, DateTime, func, Enum
import enum
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    CITIZEN = "citizen"
    ADMIN = "admin"
    AUTHORITY = "authority"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String(50), default=UserRole.CITIZEN) # can be UserRole
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_verified = Column(Boolean, default=False)

    issues = relationship("Issue", back_populates="owner", foreign_keys="[Issue.user_id]")
    comments = relationship("Comment", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    assigned_issues = relationship("Issue", back_populates="assigned_to", foreign_keys="[Issue.assigned_to_id]")
