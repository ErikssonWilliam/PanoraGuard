from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from .users_controller import UserController
from app.models import User, UserRole  # Ensure these are correctly imported


users_bp = Blueprint("users", __name__)


@users_bp.route("/create", methods=["POST"])
@jwt_required()
def create_user():
    return UserController.create_user()


# Added this route to fetch users with the GUARD role
@users_bp.route("/guards", methods=["GET"])  # New route for /users/guards endpoint
def get_guards():
    guards = User.query.filter_by(
        role=UserRole.GUARD
    ).all()  # Query to filter users with the role of GUARD
    return (
        jsonify([guard.exposed_fields() for guard in guards]),
        200,
    )  # Return the filtered results as JSON


@users_bp.route("/", methods=["GET"])
def get_users():
    return UserController.get_users()


@users_bp.route("/<uuid:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    return UserController.update_user(user_id)


# Does not work if the user has a foreign key in another table
@users_bp.route("/<uuid:user_id>", methods=["DELETE"])
def delete_user(user_id):
    return UserController.delete_user(user_id)


@users_bp.route("/<uuid:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    return UserController.get_user_by_id(user_id)
