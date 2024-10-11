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
            token = AuthService.login(username, password)
            print(token)
            return jsonify(access_token=token), 200
        except Exception as e:
            return jsonify({"msg": str(e)}), 401

    def refresh():
        current_user = get_jwt_identity()  # Hämtar användaren från refresh token
        new_access_token = create_access_token(
            identity=current_user, expires_delta=timedelta(minutes=15)
        )
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
