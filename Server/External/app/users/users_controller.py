from flask import jsonify, request
import string
import secrets

# from ..auth.auth_db_mock import users_db
from .users_service import UserService

# will request entered data, tries the calls and returns the results


class UserController:
    def get_users():
        users = UserService.get_users()
        return jsonify(
            [{"id": u.id, "username": u.username, "email": u.email} for u in users]
        ), 200

    def get_user_by_id(user_id: str):
        user = UserService.get_user_by_id(user_id)
        if user:
            return jsonify(user.exposed_fields()), 200
        return jsonify({"error": "User not found"}), 404

    def create_user():
        data = request.json

        if data.get("role") == "GUARD":
            generated_password = UserController.generate_random_password()
            data["password"] = generated_password
            print(f"Random password generated for 'guard': {generated_password}")

        if UserService.get_user_by_username(data["username"]):
            return jsonify({"error": "Name already exists"}), 400

        if UserService.get_user_by_email(data["email"]):
            return jsonify({"error": "Email already exists"}), 400

        try:
            UserController.validity_check(data)

            new_user = UserService.create_user(
                username=data["username"].strip(),
                password=data["password"],
                role=data["role"],
                email=data["email"].strip(),
            )
            return (
                jsonify({"message": "User created", "user": new_user.exposed_fields()}),
                201,
            )
        except ValueError as e:
            return jsonify({"error": str(e)}), 400

    def update_user(user_id: str):
        data = request.json
        user = UserService.get_user_by_id(user_id)
        updated = UserService.update_user(user, data)
        if updated:
            return jsonify({"message": "User updated"}), 200
        return jsonify({"message": "User not found"}), 404

    def delete_user(user_id: str):
        deleted = UserService.delete_user(user_id)
        if deleted:
            return jsonify({"message": "User deleted"}), 200
        return jsonify({"message": "User not found"}), 404

    def validity_check(data: dict):
        print(data)
        required_fields = ["username", "password", "role", "email"]

        for field in required_fields:
            if not data.get(field) or not str(data[field]).strip():
                raise ValueError(f"'{field}' is required and cannot be empty.")

        email = data.get("email").strip()
        if "@" not in email or "." not in email:
            raise ValueError("Invalid email format.")

        return True

    def generate_random_password(length=12):
        alphabet = string.ascii_letters + string.digits + string.punctuation
        password = "".join(secrets.choice(alphabet) for i in range(length))
        print(password)
        return password
