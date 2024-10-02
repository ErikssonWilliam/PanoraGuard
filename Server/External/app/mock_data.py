from .models import *
from datetime import datetime   

mock_user1 = User(
    id=1,
    username="john_doe",
    password_hash="hashed_password123",
    role=UserRole.OPERATOR,
    email="john@example.com",
    created_at=datetime.now()
)

mock_user2 = User(
    id=2,
    username="jane_doe",
    password_hash="hashed_password456",
    role=UserRole.MANAGER,
    email="jane@example.com",
    created_at=datetime.now()
)

def get_mock_user(user_id):
    if user_id == 1:
        return mock_user1
    elif user_id == 2:
        return mock_user2
    else:
        return None  # Return None if the user is not found