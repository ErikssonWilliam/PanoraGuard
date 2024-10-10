from flask import jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timedelta
from .auth_db_mock import users_db
from .auth_service import AuthService

#will request entered data, tries the calls and returns the results

#bcrypt = Bcrypt()

class AuthController:

    def login():
        username = request.json.get('username', None)
        password = request.json.get('password', None)

        try:
            token = AuthService.login(username, password)
            return jsonify(access_token = token), 200
        except Exception as e:
            return jsonify({"msg": "Invalid username or password"}), 401

    def signup():
        username = request.json.get('username', None)
        password = request.json.get('password', None)
        role = request.json.get('role', None)

        try:
            new_user = AuthService.signup(username, password, role)
            return jsonify(message='User created successfully'), 201
        except Exception as e:
            return jsonify({"msg": "Invalid username or password"}), 401

    def refresh():
        current_user = get_jwt_identity()  # Hämtar användaren från refresh token
        new_access_token = create_access_token(identity=current_user, expires_delta=timedelta(minutes=15))
        return jsonify(access_token=new_access_token), 200
    
    def protected():
        current_user = get_jwt_identity()  # hämtar den inloggade användaren
        return jsonify(logged_in_as=current_user), 200
    
    
    
#   #Logout + blacklist, tveksamt om detta är bästa hanteringen
#   @auth.route('/logout', methods=['POST'])
#   @jwt_required()
#   def logout():
#   jti = get_jwt()["jti"]  # JWT ID för att identifiera tokenen som ska ogiltigförklaras (blacklisting)
#   Här skulle du lägga till denna token till en blacklist om du implementerar en sådan
#     return jsonify(msg="Utloggad"), 200