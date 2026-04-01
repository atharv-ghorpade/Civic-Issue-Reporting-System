from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User as UserModel
from app.core.security import verify_password, get_password_hash
from app.schemas.user_schema import UserCreate

class AuthService:
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[UserModel]:
        return db.query(UserModel).filter(UserModel.email == email).first()

    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[UserModel]:
        return db.query(UserModel).filter(UserModel.username == username).first()

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[UserModel]:
        user = AuthService.get_user_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def create_user(db: Session, user_in: UserCreate) -> UserModel:
        db_user = UserModel(
            email=user_in.email,
            username=user_in.username,
            full_name=user_in.full_name,
            hashed_password=get_password_hash(user_in.password),
            role=user_in.role,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

auth_service = AuthService()
