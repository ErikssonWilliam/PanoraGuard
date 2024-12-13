"""
This file provides routes for retrieving and changing the brightness level of a camera.
In order to access these routes, the user must be logged in and have an Admin role.
"""

from flask import Blueprint, request, jsonify
import requests
from requests.auth import HTTPBasicAuth

# Assuming Camera model is imported
from .utils import (
    get_jwt_claims,
    get_camera_ip,
)
from config import Config

br_bp = Blueprint("brightness_api", __name__)

# AXIS device credentials
username = Config.CAMERA_USERNAME
password = Config.CAMERA_PASSWORD


@br_bp.route("/get-brightness", methods=["GET"])
def get_brightness():
    """
    Route for retrieving the current brightness level of a camera.
    The request must include the 'camera_id' in the query parameters.

    URL parameters:
        camera_id (str): The ID of the camera.

    Example request:
        GET /get-brightness?camera_id=<camera_id>
    """
    _, role = get_jwt_claims(request)

    # Check if the role is "ADMIN"
    if role != "ADMIN":
        return (
            jsonify(
                {
                    "error": "Unauthorized access. You need the 'ADMIN' role to get the brightness."
                }
            ),
            403,
        )

    camera_id = request.args.get("camera_id")  # Get camera_id from query parameters
    if not camera_id:
        return jsonify({"error": "camera_id is required"}), 400

    # Retrieve the camera IP address using the camera_id
    camera_ip = get_camera_ip(camera_id)
    if not camera_ip:
        return jsonify({"error": "Camera not found"}), 404

    url = f"http://{camera_ip}/axis-cgi/param.cgi?action=list&group=ImageSource.I0.Sensor.Brightness"
    response = requests.get(url, auth=HTTPBasicAuth(username, password))
    if response.status_code == 200:
        for line in response.text.splitlines():
            if "ImageSource.I0.Sensor.Brightness" in line:
                brightness_level = line.split("=")[1]
                return jsonify({"brightness_level": brightness_level}), 200
        return jsonify({"error": "Brightness level not found"}), 404
    else:
        return (
            jsonify(
                {
                    "error": "Failed to retrieve brightness level",
                    "status_code": response.status_code,
                }
            ),
            response.status_code,
        )


@br_bp.route("/set-brightness", methods=["PUT"])
def set_brightness():
    """
    Route for changing the brightness level of a camera.
    The request must include 'camera_id' and 'new_brightness' in the JSON body.

    Example request body:
        {
            "camera_id": "<camera_id>",
            "new_brightness": 75
        }
    """
    _, role = get_jwt_claims(request)

    # Check if the role is "ADMIN"
    if role != "ADMIN":
        print("role is not ADMIN")
        return (
            jsonify(
                {
                    "error": "Unauthorized access. You need the 'ADMIN' role to change the brightness."
                }
            ),
            403,
        )

    data = request.get_json()
    camera_id = data.get("camera_id")
    new_brightness = data.get("new_brightness")

    if not camera_id or new_brightness is None:
        return jsonify({"error": "Both camera_id and new_brightness are required"}), 400

    if not (0 <= new_brightness <= 100):
        return (
            jsonify({"error": "Brightness level must be an integer between 0 and 100"}),
            400,
        )

    # Retrieve the camera IP address using the camera_id
    camera_ip = get_camera_ip(camera_id)
    if not camera_ip:
        return jsonify({"error": "Camera not found"}), 404

    url = f"http://{camera_ip}/axis-cgi/param.cgi?action=update&ImageSource.I0.Sensor.Brightness={new_brightness}"
    response = requests.get(url, auth=HTTPBasicAuth(username, password))
    if response.status_code == 200:
        return (
            jsonify(
                {
                    "message": "Brightness level updated successfully",
                    "brightness_level": new_brightness,
                }
            ),
            200,
        )
    else:
        return (
            jsonify(
                {
                    "error": "Failed to update brightness level",
                    "status_code": response.status_code,
                }
            ),
            response.status_code,
        )
