from sqlalchemy import Column, ForeignKey, Integer, Text, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    issue_id = Column(Integer, ForeignKey("issues.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="comments")
    issue = relationship("Issue", back_populates="comments")
