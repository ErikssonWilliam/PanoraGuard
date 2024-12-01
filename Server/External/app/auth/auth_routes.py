"""
This file defines the authentication-related routes for the Flask application.
Routes include login and a protected example route.
"""

from flask import Blueprint
from flask_jwt_extended import jwt_required
from .auth_controller import AuthController


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Route to log in a user and retrieve a JWT token.

    Example Request:
        POST /login
        {
            "username": "user123",
            "password": "password123"
        }

    Returns:
        JSON response with the token if successful or an error message otherwise.
    """
    return AuthController.login()


@auth_bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    """
    Route to demonstrate access to a protected resource.

    Requires:
        A valid JWT token in the Authorization header.

    Returns:
        JSON response with the current logged-in user's information.
    """
    return AuthController.protected()
