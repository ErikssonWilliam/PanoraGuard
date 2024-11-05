from flask import jsonify, request
from flask_jwt_extended import (
    get_jwt_identity,
)
from .auth_service import AuthService

# will request entered data, tries the calls and returns the results

# bcrypt = Bcrypt()


class AuthController:
    def login():
        username = request.json.get("username", None)
        password = request.json.get("password", None)

        try:
            token = AuthService.login(username, password)
            print(token)
            return jsonify(access_token=token), 200
        except Exception as e:
            return jsonify({"msg": str(e)}), 401

    def protected():
        current_user = get_jwt_identity()  # hämtar den inloggade användaren
        return jsonify(logged_in_as=current_user), 200
