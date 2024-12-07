from flask import Blueprint, request, jsonify
import requests
from config import Config
from .speaker import start_speaker

al_bp = Blueprint("alarms", __name__)


@al_bp.route("/redirect", methods=["POST"])
def redirect_alarm():
    alarm_data = request.get_json()
    if not alarm_data:
        return jsonify({"error": "alarm data required"}), 400

    try:
        url = Config.EXTERNAL_ALARMS_ADD
        # Forward the POST request with the received alarm data to the deployed server
        response = requests.post(
            url, json=alarm_data, headers={"Content-Type": "application/json"}
        )

        if response.status_code == 201:
            # Start the speaker after the alarm has been added
            start_speaker()
            return jsonify({"message": "Alarm added successfully."}), 201
        else:
            return (
                jsonify({"error": "Failed to add alarm", "details": response.text}),
                response.status_code,
            )

    except requests.RequestException as e:
        return (
            jsonify(
                {"error": "An error occurred while adding the alarm", "details": str(e)}
            ),
            500,
        )
