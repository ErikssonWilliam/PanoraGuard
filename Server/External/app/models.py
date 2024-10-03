from enum import Enum
from datetime import datetime
from dataclasses import dataclass

# Define an Enum for the user roles
class UserRole(Enum):
    OPERATOR = "operator"
    MANAGER = "manager"
    ADMIN = "admin"
    GUARD = "guard"  # Optional role
    
@dataclass
class User:
    id: int  # Unique user ID
    username: str  # Username for login
    password_hash: str  # Hashed password for authentication
    role: UserRole  # User role: operator, manager, admin, guard
    email: str  # Email address
    created_at: datetime  # Timestamp of when the user was created
