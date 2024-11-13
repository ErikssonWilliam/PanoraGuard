from flask import Blueprint, request, jsonify
import requests
from requests.auth import HTTPBasicAuth

br_bp = Blueprint("brightness_api", __name__)

# AXIS device credentials
username = "root"
password = "secure"


@br_bp.route("/get-brightness", methods=["GET"])
def get_brightness():
    """
    Route for retrieving the current brightness level of a camera.
    Has to recieve the IP address of the camera in the request JSON body.
    Example request JSON body:
        {
            "camera_ip": "192.168.1.116"
        }
    """

    data = request.get_json()
    camera_ip = data.get("camera_ip")

    url = f"http://{camera_ip}/axis-cgi/param.cgi?action=list&group=ImageSource.I0.Sensor.Brightness"
    response = requests.get(url, auth=HTTPBasicAuth(username, password))
    if response.status_code == 200:
        for line in response.text.splitlines():
            if "ImageSource.I0.Sensor.Brightness" in line:
                brightness_level = line.split("=")[1]
                return jsonify({"brightness_level": brightness_level}), 200
        return jsonify({"error": "Brightness level not found"}), 404
    else:
        return jsonify(
            {
                "error": "Failed to retrieve brightness level",
                "status_code": response.status_code,
            }
        ), response.status_code


@br_bp.route("/set-brightness", methods=["PUT"])
def set_brightness():
    """
    Route for changing the brightness level of a camera.
    Has to recieve the IP address of the camera and the new brightness level in the request JSON body.
    Example request JSON body:
        {
            "camera_ip": "192.168.1.116",
            "new_brightness": 75
        }
    """

    data = request.get_json()
    camera_ip = data.get("camera_ip")
    new_brightness = data.get("new_brightness")

    if not (0 <= new_brightness <= 100):
        return jsonify(
            {"error": "Brightness level must be an integer between 0 and 100"}
        ), 400

    url = f"http://{camera_ip}/axis-cgi/param.cgi?action=update&ImageSource.I0.Sensor.Brightness={new_brightness}"
    response = requests.get(url, auth=HTTPBasicAuth(username, password))
    if response.status_code == 200:
        return jsonify(
            {
                "message": "Brightness level updated successfully",
                "brightness_level": new_brightness,
            }
        ), 200
    else:
        return jsonify(
            {
                "error": "Failed to update brightness level",
                "status_code": response.status_code,
            }
        ), response.status_code
