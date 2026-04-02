# Civic Issues Reporting System - Backend API

A high-performance FastAPI backend for managing civic issues, user authentication, and reporting.

## Features
- **Authentication**: JWT-based secure authentication.
- **Role-based Access**: Admin and Regular user permissions.
- **Issue Tracking**: Create, view, update, and categorize civic reporting issues.
- **Notifications**: System-wide notifications for issue updates.
- **Security**: Password hashing with Passlib (Bcrypt) and secure token handling.
- **Database**: SQLAlchemy ORM with support for multiple databases (PostgreSQL, SQLite).

## Folder Structure
```
/backend
│
├── app
│   ├── main.py             # Entry point
│   ├── core/               # App configuration, security, and database setup
│   ├── models/             # SQLAlchemy database models
│   ├── schemas/            # Pydantic validation schemas
│   ├── routers/            # API route controllers
│   ├── services/           # Business logic and database operations
│   └── utils/              # Helper functions and utilities
│
├── .env                    # Environment variables (template)
├── requirements.txt        # Project dependencies
└── README.md               # Project documentation
```

## Setup Instructions

### 1. Create a Virtual Environment
```bash
python -m venv venv
source venv/Scripts/activate  # On Windows
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Development Server
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
Documentation can be accessed at `http://localhost:8000/docs`.
#Civic issue reporting System
