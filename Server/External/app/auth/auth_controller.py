from flask import jsonify, request
from flask_jwt_extended import (
    get_jwt_identity,
)
from .auth_service import AuthService


class AuthController:
    def login():
        data = request.json
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return {"error": "Username and password are required"}, 400

        try:
            result = AuthService.login(username, password)
            return jsonify(result), 200
        except KeyError:
            return {"error": "User not found"}, 400
        except ValueError:
            return {"error": "Invalid password"}, 401
        except Exception as e:
            return {"error": str(e)}, 500

    def protected():
        current_user = get_jwt_identity()  # hämtar den inloggade användaren
        return jsonify(logged_in_as=current_user), 200
