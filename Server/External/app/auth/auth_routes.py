from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from app.models import *
from .auth_controller import AuthController

from .auth_db_mock import users_db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    return AuthController.login()

@auth_bp.route('/signup', methods=['POST'])
def signup():
    return AuthController.signup()

#Route för att förnya access tokens med refresh tokens
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)  # Kräver att refresh token skickas
def refresh():
    return AuthController.refresh()

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()  # Kräver giltig access token
def protected():
    return AuthController.protected()

