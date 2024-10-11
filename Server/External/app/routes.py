from flask import jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import *
from .mock_data import get_mock_user
from datetime import timedelta

# routes = Blueprint("routes", __name__)
bcrypt = Bcrypt()


# @routes.route("/")
def home():
    return "Hello world"


# Mock user profile endpoint
# @routes.route('/api/user/<user_id>', methods=['GET'])
def mock_user_profile(user_id):
    mock_user = get_mock_user(int(user_id))
    return jsonify(
        {"id": mock_user.id, "username": mock_user.username, "email": mock_user.email}
    )


# JWT-protected route example
# @routes.route('/api/protected', methods=['GET'])
@jwt_required()
def protected_route():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


# User registration (for testing)
# @routes.route('/register', methods=['POST'])


# User login
# @routes.route('/login', methods=['POST'])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = users_db.get(username, None)
    if not user or not bcrypt.check_password_hash(user["password_hash"], password):
        return jsonify({"msg": "Invalid username or password"}), 401

    access_token = create_access_token(
        identity={"username": username, "role": user["role"]},
        expires_delta=timedelta(minutes=15),
    )
    return jsonify(access_token=access_token), 200
