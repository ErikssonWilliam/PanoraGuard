from flask import jsonify, Blueprint

routes = Blueprint("routes", __name__)

@routes.route("/")
def home():
    return "Hello world"

@routes.route('/api/user', methods=['GET'])
def mock_user_profile():
    return jsonify({
        "id": 1,
        "name": "John Doe",
        "email": "johndoe@example.com"
    })

@routes.route ('/api/camera', methods=['GET'])
def mock_camera_data():
    return jsonify ({
        "id": 1,
        "location": "Hallway",
    })