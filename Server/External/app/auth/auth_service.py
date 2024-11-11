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
        if not user or not bcrypt.check_password_hash(user.password_hash, password):
            raise Exception(
                "Invalid username or password."
            )  # Raise a specific exception

        # Generate a JWT token
        access_token = create_access_token(
            identity={"user_id": user.id, "role": user.role.value},
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
