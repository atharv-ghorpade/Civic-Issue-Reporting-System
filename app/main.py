from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, issues, users, comments, admin, notifications
from app.core.database import Base, engine
import app.models # Register models with Base

# Initialize the database
Base.metadata.create_all(bind=engine)

from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    version=settings.VERSION,
)

# Ensure uploads directory exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

from fastapi import Request
from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": str(exc), "trace": traceback.format_exc()})



# Set up CORS
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
# We prefix them with our API version string
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
app.include_router(issues.router, prefix=f"{settings.API_V1_STR}/issues", tags=["Issues"])
app.include_router(comments.router, prefix=f"{settings.API_V1_STR}/comments", tags=["Comments"])
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin"])
app.include_router(notifications.router, prefix=f"{settings.API_V1_STR}/notifications", tags=["Notifications"])

@app.get("/")
def root():
    return {"message": "Welcome to the Civic Issues Reporting System API."}

@app.get("/health")
def health_check():
    return {"status": "ok"}
