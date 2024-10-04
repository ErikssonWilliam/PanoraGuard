from flask import jsonify, Blueprint
from datetime import datetime
from .models import *
from .mock_data import get_mock_user

routes = Blueprint("routes", __name__)

@routes.route("/")
def home():
    return "Hello world"

@routes.route('/api/user/<user_id>', methods=['GET'])
def mock_user_profile(user_id):
    mock_user = get_mock_user(int(user_id))
    return jsonify({   
        "id": mock_user.id,
        "username": mock_user.username,
        "email": mock_user.email
    })

@routes.route ('/api/camera', methods=['GET'])
def mock_camera_data():
    return jsonify ({
        "id": 1,
        "location": "Hallway",
    })