"""
This file contains the route for streaming the live feed from a selected camera.
It also includes functionalty for generating the video frames displayed on the frontend.
"""

from flask import Blueprint, Response, jsonify, request
from .utils import get_jwt_claims, get_camera_ip
import cv2
from config import Config

ls_bp = Blueprint("livestream", __name__)


def generate_frames(camera_ip):
    rtsp_url = f"rtsp://{Config.CAMERA_USERNAME}:{Config.CAMERA_PASSWORD}@{camera_ip}/axis-media/media.amp?videocodec=h264&resolution=800x600"

    print(rtsp_url)
    cap = cv2.VideoCapture(rtsp_url)
    if not cap.isOpened():
        return b""

    try:
        while True:
            success, frame = cap.read()
            if not success:
                break
            else:
                _, buffer = cv2.imencode(".jpg", frame)
                frame = buffer.tobytes()
                yield (
                    b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
                )
    finally:
        cap.release()


@ls_bp.route("/<camera_id>")
def video_feed(camera_id):
    """
    Route for streaming the live feed from a selected camera.

    URL parameters:
        camera_id (str): The ID of the camera.
    """

    # Get the user_id and role from the JWT claims
    _, role = get_jwt_claims(request)

    camera_ip = get_camera_ip(camera_id)
    if not camera_ip:
        return jsonify({"error": "Camera not found"}), 404
    # Pass the camera_id to the frame generator
    return Response(
        generate_frames(camera_ip), mimetype="multipart/x-mixed-replace; boundary=frame"
    )
