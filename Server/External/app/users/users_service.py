# move logic here
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

    def create_user(username: str, password: str, role: UserRole, email: str) -> User:
        new_user = User(
            username=username,
            password_hash=bcrypt.generate_password_hash(password).decode("utf-8"),
            role=role,
            email=email,
        )
        UserService.session.add(new_user)
        print(new_user.password_hash)
        print(bcrypt.check_password_hash(new_user.password_hash, password))
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
