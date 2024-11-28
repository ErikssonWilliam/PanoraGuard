# move logic here
import re
import secrets
import string
from typing import List, Union
from app.models import User, UserRole
from ..extensions import db
from app.extensions import bcrypt


class UserService:
    # Try add Type annotations for all Service classes
    session = db.session

    def get_users() -> List[User]:
        return User.query.all()

    def get_user_by_id(user_id: str) -> Union[User, None]:
        return User.query.filter_by(id=user_id).first()

    def get_user_by_username(user_name: str) -> Union[User, None]:
        return User.query.filter_by(username=user_name).first()

    def get_user_by_email(email: str):
        return User.query.filter_by(email=email).first()

    def create_user(username: str, password: str, role: UserRole, email: str) -> User:
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
        user = User.query.get(user_id)
        if user:
            UserService.session.delete(user)
            UserService.session.commit()
            return True
        return False

    def validity_check(data: dict):
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
        alphabet = string.ascii_letters + string.digits + string.punctuation
        password = "".join(secrets.choice(alphabet) for i in range(length))
        print(password)
        return password
