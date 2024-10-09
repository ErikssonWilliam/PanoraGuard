from flask import jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from .models import *
from .mock_data import get_mock_user

routes = Blueprint("routes", __name__)


@routes.route("/")
def home():
    return "Hello world"


@routes.route('/api/user/<user_id>', methods=['GET'])
def mock_user_profile(user_id):
    mock_user = get_mock_user(user_id)
    return jsonify({
        "id": mock_user.id,
        "username": mock_user.username,
        "email": mock_user.email
    })


@routes.route('/api/camera', methods=['GET'])
def mock_camera_data():
    return jsonify({
        "id": 1,
        "location": "Hallway",
    })

# Skyddad ruta med JWT-token


@routes.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
