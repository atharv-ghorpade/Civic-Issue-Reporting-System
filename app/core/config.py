from pydantic_settings import BaseSettings
from typing import List, Union
from pydantic import AnyHttpUrl, validator
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Civic Issues API")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    API_V1_STR: str = os.getenv("API_STR", "/api/v1")
    
    # DATABASE
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")
    
    # SECURITY
    SECRET_KEY: str = os.getenv("SECRET_KEY", "YOUR_SUPER_SECRET_KEY_HERE_FOR_LOCAL_DEV")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000",
    ]

    class Config:
        case_sensitive = True

settings = Settings()
