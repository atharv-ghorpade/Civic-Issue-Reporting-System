from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255), index=True, nullable=False)
    status = Column(String(50), default="open", index=True) # open, in-progress, resolved
    category = Column(String(100), index=True, nullable=False)
    priority = Column(String(50), default="medium", index=True) # low, medium, high
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True) # For authority assignment
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="issues", foreign_keys=[user_id])
    assigned_to = relationship("User", back_populates="assigned_issues", foreign_keys=[assigned_to_id])
    comments = relationship("Comment", back_populates="issue", cascade="all, delete-orphan")
    images = relationship("IssueImage", back_populates="issue", cascade="all, delete-orphan")
    status_history = relationship("StatusHistory", back_populates="issue", cascade="all, delete-orphan")
