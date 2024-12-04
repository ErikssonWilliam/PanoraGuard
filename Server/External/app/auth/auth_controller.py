"""
This file defines the AuthController class, responsible for handling HTTP requests related to authentication.
"""

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from .auth_service import AuthService


class AuthController:
    def login():
        """
        Handle user login by validating credentials and returning a JWT token.

        Example Request Body:
            {
                "username": "user123",
                "password": "password123"
            }

        Returns:
            Response: JSON containing the JWT token and user information if successful.
            Otherwise, an error message and appropriate HTTP status code.
        """

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
        """
        Handle access to a protected resource.

        Requires:
            A valid JWT token in the Authorization header.

        Returns:
            Response: JSON containing the current user's identity.
        """
        current_user = get_jwt_identity()
        return jsonify(logged_in_as=current_user), 200
