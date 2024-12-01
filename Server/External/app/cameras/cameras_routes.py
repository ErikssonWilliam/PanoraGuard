"""
Routes for managing camera-related operations.
These routes are secured with JWT authentication and call the respective methods in the CameraController.
"""

from flask_jwt_extended import jwt_required
from flask import Blueprint
from .cameras_controller import CameraController

cameras_bp = Blueprint("cameras", __name__)


@cameras_bp.route("/", methods=["GET"])
@jwt_required()
def get_cameras():
    """
    Route to get a list of all cameras.

    Returns:
        Response: JSON list of cameras.
    """
    return CameraController.get_cameras()


@cameras_bp.route("/locations", methods=["GET"])
@jwt_required()
def locations():
    """
    Route to get a list of unique camera locations.

    Returns:
        Response: JSON list of locations.
    """
    return CameraController.locations()


@cameras_bp.route("/locations/<string:location>", methods=["GET"])
@jwt_required()
def cameraID_by_location(location):
    """
    Route to get camera IDs by a specific location.

    Parameters:
        location (str): The location to filter cameras.

    Returns:
        Response: JSON list of camera IDs.
    """
    return CameraController.cameraID_by_location(location)


@cameras_bp.route("/<string:camera_id>/confidence", methods=["GET"])
@jwt_required()
def get_confidence_threshold(camera_id):
    """
    Route to get the confidence threshold for a specific camera.

    Parameters:
        camera_id (str): The ID of the camera.

    Returns:
        Response: JSON with the confidence threshold.
    """
    return CameraController.get_confidence_threshold(camera_id)


@cameras_bp.route("/<string:camera_id>", methods=["GET"])
@jwt_required()
def get_camera_by_id(camera_id):
    """
    Route to get details of a specific camera.

    Parameters:
        camera_id (str): The ID of the camera.

    Returns:
        Response: JSON with camera details or a 404 error if not found.
    """
    return CameraController.get_camera(camera_id)


@cameras_bp.route("/<string:camera_id>/conf/<string:confidence>", methods=["POST"])
@jwt_required()
def set_confidence(camera_id, confidence):
    """
    Route to set the confidence threshold for a specific camera.

    Parameters:
        camera_id (str): The ID of the camera.
        confidence (str): The confidence threshold to set.

    Returns:
        Response: JSON indicating success or failure.
    """
    return CameraController.set_confidence(camera_id, confidence)


@cameras_bp.route("/<string:camera_id>/confidence", methods=["PUT"])
@jwt_required()
def update_confidence(camera_id):
    """
    Route to update the confidence threshold for a specific camera.

    Parameters:
        camera_id (str): The ID of the camera.

    Returns:
        Response: JSON indicating success or failure.
    """
    return CameraController.update_confidence(camera_id)


@cameras_bp.route("/<string:camera_id>/location", methods=["PUT"])
@jwt_required()
def update_location(camera_id):
    """
    Route to update the location of a specific camera.

    Parameters:
        camera_id (str): The ID of the camera.

    Returns:
        Response: JSON indicating success or failure.
    """
    return CameraController.update_location(camera_id)


@cameras_bp.route("/upload/data", methods=["POST"])
@jwt_required()
def process_camera_data():
    """
    Route to process uploaded camera data.

    Returns:
        Response: JSON with the received data or a failure message.
    """
    return CameraController.process_camera_data()


@cameras_bp.route("/<string:camera_id>/ip", methods=["PUT"])
@jwt_required()
def update_ip(camera_id):
    """
    Route to update the IP address of a specific camera.

    Parameters:
        camera_id (str): The ID of the camera.

    Returns:
        Response: JSON indicating success or failure.
    """
    return CameraController.update_ip(camera_id)


@cameras_bp.route("/<string:camera_id>/schedule", methods=["PUT"])
@jwt_required()
def update_schedule(camera_id):
    """
    Route to update the schedule of a specific camera.

    Parameters:
        camera_id (str): The ID of the camera.

    Returns:
        Response: JSON indicating success or failure.
    """
    return CameraController.update_schedule(camera_id)
