from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from .models import User, UserRole
from datetime import datetime, timedelta

auth = Blueprint('auth', __name__)
bcrypt = Bcrypt()

# Dummy users database (kan ersättas med riktig databas)
users_db = {
    "john_doe": {
        "password_hash": bcrypt.generate_password_hash("password123").decode('utf-8'),
        "role": UserRole.OPERATOR
    },
    "jane_doe": {
        "password_hash": bcrypt.generate_password_hash("password456").decode('utf-8'),
        "role": UserRole.MANAGER
    }
}

@auth.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    user = users_db.get(username, None)
    if not user or not bcrypt.check_password_hash(user['password_hash'], password):
        return jsonify({"msg": "Fel användarnamn eller lösenord"}), 401

    # Generera en JWT-token
    access_token = create_access_token(identity={"username": username, "role": user['role'].value}, expires_delta=timedelta(minutes=15))
   
    refresh_token = create_refresh_token(identity={"username": username, "role": user['role'].value}, expires_delta=timedelta(days=1))
    
    
    
    return jsonify(access_token=access_token, refresh_token=refresh_token), 200

#Route för att förnya access tokens med refresh tokens
@auth.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)  # Kräver att refresh token skickas
def refresh():
    current_user = get_jwt_identity()  # Hämtar användaren från refresh token
    new_access_token = create_access_token(identity=current_user, expires_delta=timedelta(minutes=15))
    
    return jsonify(access_token=new_access_token), 200


@auth.route('/protected', methods=['GET'])
@jwt_required()  # Kräver giltig access token
def protected():
    current_user = get_jwt_identity()  # Hämtar den inloggade användarens identitet från access token
    return jsonify(logged_in_as=current_user), 200


# #Logout + blacklist, tveksamt om detta är bästa hanteringen
# @auth.route('/logout', methods=['POST'])
# @jwt_required()
# def logout():
#     jti = get_jwt()["jti"]  # JWT ID för att identifiera tokenen som ska ogiltigförklaras (blacklisting)
#     # Här skulle du lägga till denna token till en blacklist om du implementerar en sådan
#     return jsonify(msg="Utloggad"), 200
