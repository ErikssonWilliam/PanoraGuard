from flask import Blueprint
from flask_jwt_extended import (
    jwt_required,
)
from app.models import *
from .auth_controller import AuthController


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    return AuthController.login()


# Route för att förnya access tokens med refresh tokens
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)  # Kräver att refresh token skickas
def refresh():
    return AuthController.refresh()


@auth_bp.route("/protected", methods=["GET"])
@jwt_required()  # Kräver giltig access token
def protected():
    return AuthController.protected()
