"""
Defines the route mappings for the alarms module. Each route corresponds to a specific
controller function, facilitating the handling of HTTP requests for alarm-related operations.
"""

from flask import Blueprint
from .alarms_controller import AlarmController
from flask_jwt_extended import jwt_required

alarms_bp = Blueprint("alarms", __name__)


@alarms_bp.route("", methods=["GET"])
@jwt_required()
def get_alarms():
    """
    Retrieves all alarms.

    Example Request:
        GET /

    Returns:
        JSON response with a list of alarms and HTTP status 200.
    """
    return AlarmController.get_alarms()


@alarms_bp.route("/type/<string:type>", methods=["GET"])
@jwt_required()
def get_active_alarms(type):
    return AlarmController.get_active_alarms(type)


@alarms_bp.route("/count", methods=["GET"])
@jwt_required()
def count_alarms():
    return AlarmController.count_alarms()


@alarms_bp.route("/<string:alarm_ID>/image", methods=["GET"])
@jwt_required()
def get_alarm_image(alarm_ID):
    return AlarmController.get_alarm_image(alarm_ID)


@alarms_bp.route("byoperator/<string:operator>", methods=["GET"])
@jwt_required()
def get_alarm_by_operator(operator):
    return AlarmController.get_alarm_by_operator(operator)


@alarms_bp.route("bylocation/<string:location>/<string:camera_ID>", methods=["GET"])
@jwt_required()
def get_alarm_by_camera(location, camera_ID):
    return AlarmController.get_alarm_by_camera(location, camera_ID)


@alarms_bp.route("/notify/<string:guard_ID>/<string:alarm_ID>", methods=["POST"])
@jwt_required()
def notify_guard(guard_ID, alarm_ID):
    """
    Route for notifying a specific guard about a particular alarm.

    URL Parameters:
        guard_ID (str): The unique identifier of the guard to be notified.
        alarm_ID (str): The unique identifier of the alarm.

    Example Request:
        POST /alarms/notify/35ad0eab-2347-404e-a833-d8b2fb0367ff/cc006a17-0852-4e0e-b13c-36e4092f767d

    Description:
        This route triggers an email notification to the specified guard, including details about the alarm
        and its associated image. The alarm status is updated to "NOTIFIED" upon successful notification.

    Returns:
        Response indicating success or failure of the notification process.
    """
    return AlarmController.notify_guard(guard_ID, alarm_ID)


@alarms_bp.route("/add", methods=["POST"])
def add_alarm():
    """
    Adds a new alarm to the system.

    Example Request:
        POST /add

    Example Request Body:
        {
            "camera_id": "12345",
            "confidence_score": 0.95,
            "type": "human",
            "image_base64": "<base64-encoded string>"
        }

    Returns:
        JSON response indicating success (201) or failure (400) with a relevant message.
    """
    return AlarmController.add_alarm()


@alarms_bp.route("/<string:alarm_id>", methods=["GET"])
@jwt_required()
def get_alarm_by_id(alarm_id):
    return AlarmController.get_alarm_by_id(alarm_id)


@alarms_bp.route("/<string:alarm_id>", methods=["DELETE"])
@jwt_required()
def delete_alarm_by_id(alarm_id):
    return AlarmController.delete_alarm_by_id(alarm_id)


@alarms_bp.route("/<string:alarm_id>/status", methods=["PUT"])
@jwt_required()
def update_alarm_status(alarm_id):
    """
    Route for updating the status of a specific alarm.

    URL Parameters:
        alarm_id (str): The unique identifier of the alarm to update.

    Example Request:
        PUT /alarms/cc006a17-0852-4e0e-b13c-36e4092f767d/status

    Example Request Body:
        {
            "status": "RESOLVED",
            "guard_id": "35ad0eab-2347-404e-a833-d8b2fb0367ff",
            "operator_id": "71ad6eab-3337-444e-b923-d8b2fb0367gg"
        }

    Returns:
        Response with the updated alarm details if successful, or an error message if the alarm is not found
        or the input is invalid.
    """
    return AlarmController.update_alarm_status(alarm_id)
