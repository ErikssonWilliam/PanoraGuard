from flask import jsonify, Blueprint, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import *
from .mock_data import get_mock_user
from datetime import timedelta

routes = Blueprint("routes", __name__)
bcrypt = Bcrypt()

# Dummy users database (replace with actual database)
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

@routes.route("/")
def home():
    return "Hello world"

# Mock user profile endpoint
@routes.route('/api/user/<user_id>', methods=['GET'])
def mock_user_profile(user_id):
    mock_user = get_mock_user(int(user_id))
    return jsonify({
        "id": mock_user.id,
        "username": mock_user.username,
        "email": mock_user.email
    })

# Mock camera data
@routes.route('/api/camera', methods=['GET'])
def mock_camera_data():
    return jsonify({
        "id": 1,
        "location": "Hallway",
    })

# JWT-protected route example
@routes.route('/api/protected', methods=['GET'])
@jwt_required()
def protected_route():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


# User registration (for testing)
@routes.route('/register', methods=['POST'])
def register():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    role = request.json.get('role', None)

    if not username or not password or not role:
        return jsonify({"msg": "Missing fields"}), 400

    if username in users_db:
        return jsonify({"msg": "User already exists"}), 409

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    users_db[username] = {
        "password_hash": password_hash,
        "role": role
    }

    return jsonify({"msg": "User created successfully"}), 201

# User login 
@routes.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    user = users_db.get(username, None)
    if not user or not bcrypt.check_password_hash(user['password_hash'], password):
        return jsonify({"msg": "Invalid username or password"}), 401

    access_token = create_access_token(identity={"username": username, "role": user['role']}, expires_delta=timedelta(minutes=15))
    return jsonify(access_token=access_token), 200