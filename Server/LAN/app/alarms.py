from flask import Blueprint, request, jsonify
import requests

al_bp = Blueprint("alarms", __name__)


@al_bp.route("/redirect", methods=["POST"])
def redirect_alarm():
    alarm_data = request.get_json()
    if not alarm_data:
        return jsonify({"error": "alarm data required"}), 400

    try:
        url = "https://company3-externalserver.azurewebsites.net/alarms/add"
        # Forward the POST request with the received alarm data to the deployed server
        response = requests.post(
            url, json=alarm_data, headers={"Content-Type": "application/json"}
        )

        if response.status_code == 201:
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
