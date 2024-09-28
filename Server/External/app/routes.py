from flask import jsonify
from app import app

@app.route("/")
def home():
    return "Hello world"

@app.route('/api/user', methods=['GET'])
def mock_user_profile():
    return jsonify({
        "id": 1,
        "name": "John Doe",
        "email": "johndoe@example.com"
    })

@app.route ('/api/camera', methods=['GET'])
def mock_camera_data():
    return jsonify ({
        "id": 1,
        "location": "Hallway",
    })