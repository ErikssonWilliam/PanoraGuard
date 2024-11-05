from flask import jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
)
from datetime import timedelta
from .auth_service import AuthService

# will request entered data, tries the calls and returns the results

# bcrypt = Bcrypt()


class AuthController:
    def login():
        username = request.json.get("username", None)
        password = request.json.get("password", None)

        try:
            user = AuthService.login(username, password)
            print(user)
            return jsonify(user), 200
        except Exception as e:
            return jsonify({"msg": str(e)}), 401
        

    def protected():
        current_user = get_jwt_identity()  # hämtar den inloggade användaren
        return jsonify(logged_in_as=current_user), 200


