"""
This file implements the controller layer for the alarms module. It manages the interactions
between HTTP requests and the alarm service layer, including operations like retrieving,
creating, updating, and deleting alarms. It also includes functionalities for notifying guards
and fetching alarm-related data for frontend usage.
"""

from flask import current_app, request, jsonify
from .alarms_service import AlarmService
from app.socketio_instance import socketio
import requests
from config import Config


class AlarmController:
    def get_alarms():
        """
        Retrieves alarms with pagination.

        Query Parameters:
        page (int): The current page number (default is 1).
        per_page (int): The number of alarms per page (default is 10).

        Returns:
        Response: JSON response with a list of alarms and HTTP status code 200.
        """
        # Get query parameters for pagination with default values
        page = request.args.get("page", default=1, type=int)
        per_page = request.args.get("per_page", default=10, type=int)
        # Retrieve paginated alarms
        alarms = AlarmService.get_alarms(page=page, per_page=per_page)

        return jsonify(alarms), 200

    def count_alarms():
        """
        Endpoint to retrieve the total number of alarms in the database.

        Returns:
            JSON: A JSON object containing the total number of alarms.
        """
        try:
            total_alarms = AlarmService.get_total_records()
            return jsonify({"success": True, "total_alarms": total_alarms}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    def get_active_alarms(type):
        """
        Retrieves active alarms based on the specified type ('new' or 'old').

        Parameters:
            type (str): The type of active alarms to retrieve.

        Returns:
            Response: JSON response with the filtered alarms and HTTP status code 200.
        """
        return jsonify(AlarmService.get_active_alarms(type)), 200

    @staticmethod
    def add_alarm():
        """
        Creates a new alarm with the provided data and notifies the frontend if successful.

        Request Body:
            JSON object containing alarm details such as camera_id, confidence_score, type, and image_base64.

        Returns:
            Response: JSON response indicating success (201) or failure (400) along with the relevant message.
        """
        alarm_data = request.get_json()
        new_alarm = AlarmService.create_alarm(alarm_data)
        if new_alarm["status"] == "success":
            # Notify frontend about the new alarm
            with current_app.app_context():
                socketio.emit("new_alarm", new_alarm["alarm"])
            # Turning on speaker through LAN-Server
            return jsonify(new_alarm), 201
        else:
            return jsonify({"message": new_alarm["message"]}), 400

    @staticmethod
    def __start_speaker():
        """
        Private static method to turn on the speaker at the LAN server.
        """
        try:
            response = requests.post(Config.SPEAKER_URL)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Failed to start speaker: {e}")
            return None

    def get_alarm_image(alarm_ID):
        return AlarmService.get_alarm_image(alarm_ID)

    def get_alarm_by_operator(operator):
        return AlarmService.get_alarm_by_operator(operator)

    def get_alarm_by_camera(location, camera_ID):
        return AlarmService.get_alarm_by_camera(location, camera_ID)

    def notify_guard(guard_ID, alarm_ID):
        """
        Function that notifies a guard by sending an email containing
        the image of the alarm.

        Parameters:
            guard_ID (str): The guard to be notified
            alarm_ID (str): The alarm that contains the image

        Returns:
            Response: JSON response with indicating success or error.
        """
        return AlarmService.notify_guard(guard_ID, alarm_ID)

    def update_alarm_status(alarm_id):
        """
        Updates the status of an alarm by its unique identifier. Optionally associates the
        update with a guard or operator.

        Parameters:
            alarm_id (str): The unique identifier of the alarm.

        Request Body:
            JSON object containing:
                - status (str): The new status of the alarm.
                - guard_id (Optional[str]): ID of the guard to associate with the alarm.
                - operator_id (Optional[str]): ID of the operator updating the alarm.

        Returns:
            Response: JSON response with updated alarm details (200) or error message (404).
        """
        alarm_data = request.get_json()
        if not alarm_data or "status" not in alarm_data:
            return jsonify({"message": "Status is required"}), 400

        guard_id = alarm_data.get("guard_id")
        operator_id = alarm_data.get("operator_id")
        updated_alarm = AlarmService.update_alarm_status(
            alarm_id, alarm_data["status"], guard_id, operator_id
        )
        if updated_alarm:
            return jsonify(updated_alarm), 200
        else:
            return (
                jsonify({"message": "Alarm not found or invalid guard/operator ID"}),
                404,
            )
