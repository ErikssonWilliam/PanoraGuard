from flask import jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from .auth_db_mock import users_db
from datetime import datetime, timedelta
from ..users.users_controller import UserController

bcrypt = Bcrypt()

class AuthService:
    def login(username, password):
        user = users_db.get(username, None)
        if not user or not bcrypt.check_password_hash(user['password_hash'], password):
                 return jsonify({"msg": "Fel användarnamn eller lösenord"}), 401

    # Generera en JWT-token
        access_token = create_access_token(identity={"username": username, "role": user['role'].value}, expires_delta=timedelta(minutes=15))
        refresh_token = create_refresh_token(identity={"username": username, "role": user['role'].value}, expires_delta=timedelta(days=1))
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    
    def signup(username, password, role):
        return UserController.create_user(username, password, role)