"""
Routes for managing user-related operations.
These routes are secured with JWT authentication
and call the respective methods in the UserController.
"""

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from .users_controller import UserController
from app.models import User, UserRole


users_bp = Blueprint("users", __name__)


@users_bp.route("/create", methods=["POST"])
@jwt_required()
def create_user():
    """
    Route to create a new user.

    Returns:
        Response: JSON indicating success or failure.
    """
    return UserController.create_user()


@users_bp.route("/guards", methods=["GET"])
@jwt_required()
def get_guards():
    """
    Route to fetch all users with the 'GUARD' role.

    Returns:
        Response: JSON list of GUARD users.
    """
    guards = User.query.filter_by(role=UserRole.GUARD).all()
    return (
        jsonify([guard.exposed_fields() for guard in guards]),
        200,
    )


@users_bp.route("/", methods=["GET"])
@jwt_required()
def get_users():
    """
    Route to fetch all users.

    Returns:
        Response: JSON list of users.
    """
    return UserController.get_users()


@users_bp.route("/<uuid:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    """
    Route to update a specific user.

    Parameters:
        user_id (uuid): The ID of the user to update.

    Returns:
        Response: JSON indicating success or failure.
    """
    return UserController.update_user(user_id)


@users_bp.route("/<uuid:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    """
    Route to delete a specific user.

    Parameters:
        user_id (uuid): The ID of the user to delete.

    Returns:
        Response: JSON indicating success or failure.
    """
    return UserController.delete_user(user_id)


@users_bp.route("/<uuid:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    """
    Route to fetch details of a specific user.

    Parameters:
        user_id (uuid): The ID of the user.

    Returns:
        Response: JSON with user details.
    """
    return UserController.get_user_by_id(user_id)
