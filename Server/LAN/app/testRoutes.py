from flask import Blueprint, request, jsonify
import requests
import jwt
from requests.auth import HTTPBasicAuth

test_bp = Blueprint("test_api", __name__)

# AXIS device credentials
username = "root"
password = "secure"

# AXIS device credentials
username = "root"
password = "secure"


@test_bp.route("/test-supported-api-version", methods=["GET"])
def api_version():
    # Extract JSON data from the incoming request
    # client_data = request.get_json()

    client_data = {"context": "my context", "method": "getSupportedVersions"}

    # Define the external URL
    # Replace with actual external address
    external_url = "http://192.168.1.116/axis-cgi/lightcontrol.cgi"

    # AXIS device credentials
    username = "root"
    password = "secure"

    # Send POST request to the external server
    response = requests.post(
        external_url, json=client_data, auth=HTTPBasicAuth(username, password)
    )

    # Handle the response from the external server
    if response.status_code == 200:
        return jsonify({"status": "success", "external_response": response.json()}), 200
    else:
        return (
            jsonify({"status": "failed", "error": response.text}),
            response.status_code,
        )


@test_bp.route("/test-lightcontrol", methods=["GET"])
def light_control():
    # Extract JSON data from the incoming request
    # client_data = request.get_json()

    client_data = {
        "apiVersion": "1.0",
        "context": "my context",
        "method": "getLightInformation",
        "params": {},
    }

    # Define the external URL
    # Replace with actual external address
    external_url = "http://192.168.1.116/axis-cgi/lightcontrol.cgi"

    # AXIS device credentials
    username = "root"
    password = "secure"

    # Send POST request to the external server
    response = requests.post(
        external_url, json=client_data, auth=HTTPBasicAuth(username, password)
    )

    # Handle the response from the external server
    if response.status_code == 200:
        return jsonify({"status": "success", "external_response": response.json()}), 200
    else:
        return (
            jsonify({"status": "failed", "error": response.text}),
            response.status_code,
        )


@test_bp.route("/get-optics-info", methods=["GET"])
def optics_info():
    # Extract JSON data from the incoming request
    # client_data = request.get_json()

    client_data = {"apiVersion": "1.1", "context": "abc", "method": "getOptics"}

    # Define the external URL
    # Replace with actual external address
    external_url = "http://192.168.1.116/axis-cgi/opticscontrol.cgi"

    # AXIS device credentials
    username = "root"
    password = "secure"

    # Send POST request to the external server
    response = requests.post(
        external_url, json=client_data, auth=HTTPBasicAuth(username, password)
    )

    # Handle the response from the external server
    if response.status_code == 200:
        return jsonify({"status": "success", "external_response": response.json()}), 200
    else:
        return (
            jsonify({"status": "failed", "error": response.text}),
            response.status_code,
        )


@test_bp.route("/set-magnification", methods=["GET"])
def set_magnification():
    # Extract JSON data from the incoming request
    # client_data = request.get_json()

    client_data = {
        "apiVersion": "1.1",
        "context": "abc",
        "method": "setMagnification",
        "params": {"optics": [{"opticsId": "0", "magnification": 1.0}]},
    }

    # Define the external URL
    # Replace with actual external address
    external_url = "http://192.168.1.116/axis-cgi/opticscontrol.cgi"

    # AXIS device credentials
    username = "root"
    password = "secure"

    # Send POST request to the external server
    response = requests.post(
        external_url, json=client_data, auth=HTTPBasicAuth(username, password)
    )

    # Handle the response from the external server
    if response.status_code == 200:
        return jsonify({"status": "success", "external_response": response.json()}), 200
    else:
        return (
            jsonify({"status": "failed", "error": response.text}),
            response.status_code,
        )


@test_bp.route("/jwt", methods=["GET"])
def test_jwt_works_in_both_servers():
    auth_header = request.headers.get("Authorization")

    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        return jwt.decode(token, "your_random_secret_text", algorithms="HS256")


# Function to enable or disable ACAP
def enable_disable_acap(url, action, acap_name):
    try:
        response = requests.post(url, auth=HTTPBasicAuth(username, password))
        # response = requests.post(url, data=client_data, auth=HTTPBasicAuth(username, password), stream=True)

        if response.status_code == 200:
            return {
                "status": "success",
                "message": f"{action} of {acap_name} was successful",
            }
        else:
            return {"status": "failed", "error": response.text}
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return {"status": "failed", "error": str(e)}


@test_bp.route("/acap/<string:action>/<string:acap_name>", methods=["GET"])
def schedule_acap(action, acap_name):
    # Extract JSON data from the incoming request
    # client_data = request.get_json()

    # Camera details
    camera_ip = "192.168.1.116"

    # Define the external URL
    url = f"http://{camera_ip}/axis-cgi/applications/control.cgi?action={action}&package={acap_name}"

    try:
        result = enable_disable_acap(url, action, acap_name)

        return jsonify(result), 200 if result["status"] == "success" else 500
    except Exception as e:
        return jsonify({"status": "failed", "error": str(e)}), 500


@test_bp.route("/add-schedule", methods=["GET"])
def add_schedule():
    name = "Test schedule"
    start_time = "2024-10-18T18:00:00"
    end_time = "2024-10-19T06:00:00"
    rrule = "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR"

    camera_ip = "192.168.1.116"

    url = f"http://{camera_ip}/axis-cgi/events/schedule.cgi"
    data = {
        "name": name,
        "schedule": {
            "start": start_time,  # Example: "2023-10-17T18:00:00"
            "end": end_time,  # Example: "2023-10-18T06:00:00"
            "rrule": rrule,  # Example: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR"
        },
    }

    response = requests.post(url, json=data, auth=HTTPBasicAuth(username, password))

    if response.status_code == 200:
        return {"status": "success", "message": "Scheduled event created successfully"}
    else:
        return {"status": "failed", "error": response.text}


# Speaker code from Alina


@test_bp.route("/start-speaker", methods=["GET"])
def start_speaker():
    # Extract JSON data from the incoming request
    # client_data = request.get_json()
    # Define the external URL
    # Replace with actual external address
    external_url = "http://192.168.1.108/axis-cgi/playclip.cgi?location=alarm.mp3&repeat=-1&volume=4&audiodeviceid=0&audiooutputid=0"

    # AXIS device credentials
    username = "root"
    password = "secure"

    # Send POST request to the external server
    response = requests.post(external_url, auth=HTTPBasicAuth(username, password))

    # Handle the response from the external server
    if response.status_code == 200:
        return jsonify({"status": "success", "external_response": response.json()}), 200
    else:
        return (
            jsonify({"status": "failed", "error": response.text}),
            response.status_code,
        )


@test_bp.route("/stop-speaker", methods=["GET"])
def stop_speaker():
    # Extract JSON data from the incoming request
    # client_data = request.get_json()

    # Define the external URL
    # Replace with actual external address
    external_url = "http://192.168.1.108/axis-cgi/stopclip.cgi"

    # AXIS device credentials
    username = "root"
    password = "secure"

    # Send POST request to the external server
    response = requests.post(external_url, auth=HTTPBasicAuth(username, password))

    # Handle the response from the external server
    if response.status_code == 200:
        return jsonify({"status": "success", "external_response": response.json()}), 200
    else:
        return (
            jsonify({"status": "failed", "error": response.text}),
            response.status_code,
        )
