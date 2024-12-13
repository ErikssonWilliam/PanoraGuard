"""
This file contains routes for controlling the speaker.
It includes routes to start and stop playing an audio clip on the speaker.
"""

from flask import Blueprint, jsonify
import requests
from requests.auth import HTTPBasicAuth
from config import Config

speaker_bp = Blueprint("speaker_api", __name__)

# AXIS device credentials
username = Config.CAMERA_USERNAME
password = Config.CAMERA_PASSWORD
speaker_ip_adress = Config.SPEAKER_IP


@speaker_bp.route("/start-speaker", methods=["POST"])
def start_speaker():
    """
    Route for starting an audio clip to run on repeat on the speaker.
    """

    # Define the speaker URL
    external_url = f"http://{speaker_ip_adress}/axis-cgi/playclip.cgi?location=alarm.mp3&repeat=-1&volume=4&audiodeviceid=0&audiooutputid=0"

    # Send POST request to the speaker
    response = requests.post(external_url, auth=HTTPBasicAuth(username, password))

    # Handle the response from the speaker
    if response.status_code == 200:
        return jsonify({"status": "success"}), 200
    else:
        return (
            jsonify({"status": "failed", "error": response.text}),
            response.status_code,
        )


@speaker_bp.route("/stop-speaker", methods=["POST"])
def stop_speaker():
    """
    Route for stopping the currently playing audio clip on the speaker.
    """

    # Define the speaker URL
    external_url = f"http://{speaker_ip_adress}/axis-cgi/stopclip.cgi"

    # Send POST request to the speaker server
    response = requests.post(external_url, auth=HTTPBasicAuth(username, password))

    # Handle the response from the speaker server
    if response.status_code == 200:
        return jsonify({"status": "success"}), 200
    else:
        return (
            jsonify({"status": "failed", "error": response.text}),
            response.status_code,
        )
