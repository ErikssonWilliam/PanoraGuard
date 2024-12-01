"""
This file defines the AuthService class, responsible for handling authentication-related logic.
It includes functionalities such as logging in a user by validating credentials and generating
JWT tokens.
"""

from flask_jwt_extended import create_access_token
from datetime import timedelta
from ..users.users_service import UserService
from app.extensions import bcrypt


class AuthService:
    @staticmethod
    def login(username, password):
        """
        Authenticate a user by username and password, and return a JWT token if successful.

        Parameters:
            username (str): The username of the user.
            password (str): The plain-text password of the user.

        Returns:
            dict: A dictionary containing the access token, role, and user ID.

        Raises:
            KeyError: If the user does not exist.
            ValueError: If the password is incorrect.
        """

        user = UserService.get_user_by_username(username)

        if not user:
            raise KeyError("User not found")

        if not AuthService.verify_password(user.password_hash, password):
            raise ValueError("Invalid password")

        access_token = create_access_token(
            identity={"user_id": user.id, "role": user.role.value},
            expires_delta=timedelta(hours=12),
        )

        return {
            "access_token": access_token,
            "role": user.role.value,
            "user_id": user.id,
        }

    def verify_password(password_hash, password):
        """
        Verify a password against its hashed version.

        Parameters:
            password_hash (str): The hashed password.
            password (str): The plain-text password.

        Returns:
            bool: True if the password matches the hash, False otherwise.
        """
        return bcrypt.check_password_hash(password_hash, password)
