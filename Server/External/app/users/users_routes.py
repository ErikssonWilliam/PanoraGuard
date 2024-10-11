from flask import Blueprint
from .users_controller import UserController

users_bp = Blueprint("users", __name__)


@users_bp.route("/create", methods=["POST"])
def create_user():
    return UserController.create_user()


@users_bp.route("/", methods=["GET"])
def get_users():
    return UserController.get_users()


@users_bp.route("/<uuid:user_id>", methods=["PUT"])
def update_user(user_id):
    return UserController.update_user(user_id)


# Does not work if the user has a foreign key in another table
@users_bp.route("/<uuid:user_id>", methods=["DELETE"])
def delete_user(user_id):
    return UserController.delete_user(user_id)


@users_bp.route("/<uuid:user_id>", methods=["GET"])
def get_user(user_id):
    return UserController.get_user_by_id(user_id)
