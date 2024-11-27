from flask_jwt_extended import (
    create_access_token,
)
from datetime import timedelta
from ..users.users_service import UserService
from app.extensions import bcrypt


class AuthService:
    @staticmethod
    def login(username, password):
        user = UserService.get_user_by_username(username)

        if not user:
            raise KeyError("User not found")

        if not AuthService.verify_password(user.password_hash, password):
            raise ValueError("Invalid password")

        # Generate a JWT token
        access_token = create_access_token(
            identity=str(user.id),  # Pass the user_id as a string
            expires_delta=timedelta(hours=12),
        )

        return {
            "access_token": access_token,
            "role": user.role.value,
            "user_id": user.id,
        }  # Return a dictionary

    @staticmethod
    def signup(username, password, role):
        return

    def verify_password(password_hash, password):
        return bcrypt.check_password_hash(password_hash, password)
