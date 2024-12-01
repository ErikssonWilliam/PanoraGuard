"""
Service for managing user-related operations.
This service interacts directly with the database models and handles business logic.
"""

import re
import secrets
import string
from typing import List, Union
from app.models import User, UserRole
from ..extensions import db
from app.extensions import bcrypt


class UserService:
    session = db.session

    def get_users() -> List[User]:
        """
        Retrieve a list of all users.

        Returns:
            List[User]: List of User objects.
        """
        return User.query.all()

    def get_user_by_id(user_id: str) -> Union[User, None]:
        # Retrieve a user by their ID
        return User.query.filter_by(id=user_id).first()

    def get_user_by_username(user_name: str) -> Union[User, None]:
        # Retrieve a user by their username
        return User.query.filter_by(username=user_name).first()

    def get_user_by_email(email: str):
        # Retrieve a user by their email address
        return User.query.filter_by(email=email).first()

    def create_user(username: str, password: str, role: UserRole, email: str) -> User:
        """
        Create a new user.

        Parameters:
            username (str): The username of the user.
            password (str): The plain-text password of the user.
            role (UserRole): The role of the user (e.g., GUARD, OPERATOR).
            email (str): The email of the user.

        Returns:
            User: The created User object.
        """

        new_user = User(
            username=username,
            password_hash=bcrypt.generate_password_hash(password).decode("utf-8"),
            role=role,
            email=email,
        )
        UserService.session.add(new_user)
        UserService.session.commit()
        return new_user

    def update_user(user: User, data: dict) -> User:
        """
        Update user details.

        Parameters:
            user (User): The User object to update.
            data (dict): Dictionary of fields to update.

        Returns:
            User: The updated User object.
        """

        if data.get("username"):
            user.username = data.get("username")
        if data.get("email"):
            user.email = data.get("email")
        if data.get("role"):
            user.role = data.get("role")
        if data.get("newPassword"):
            user.password_hash = bcrypt.generate_password_hash(
                data.get("newPassword")
            ).decode("utf-8")
        UserService.session.commit()
        return user

    def delete_user(user_id: str) -> bool:
        """
        Delete a user by their ID.

        Parameters:
            user_id (str): The ID of the user to delete.

        Returns:
            bool: True if user was deleted, False otherwise.
        """
        user = User.query.get(user_id)
        if user:
            UserService.session.delete(user)
            UserService.session.commit()
            return True
        return False

    def validity_check(data: dict):
        """
        Validate user input data for creating/updating a user.

        Parameters:
            data (dict): Dictionary of user data.

        Raises:
            ValueError: If any required field is missing or invalid.

        Returns:
            bool: True if validation succeeds.
        """
        required_fields = ["username", "password", "role", "email"]

        for field in required_fields:
            if not data.get(field) or not str(data[field]).strip():
                raise ValueError(f"'{field}' is required and cannot be empty.")

        role = data.get("role")
        if role not in ["GUARD", "OPERATOR", "MANAGER"]:
            raise ValueError("Invalid role.")
        email = data.get("email").strip()
        is_valid_email = (
            re.match(r"^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$", email) is not None
        )
        if not is_valid_email:
            raise ValueError("Invalid email format.")

        return True

    def generate_random_password(length=12):
        """
        Generate a random secure password.

        Parameters:
            length (int): The length of the password (default is 12).

        Returns:
            str: The generated password.
        """
        alphabet = string.ascii_letters + string.digits + string.punctuation
        password = "".join(secrets.choice(alphabet) for i in range(length))
        print(password)
        return password
