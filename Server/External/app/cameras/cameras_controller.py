"""
Controller for managing camera-related operations.
This class handles HTTP requests, validates input data,
and interacts with the CameraService.
"""

from flask import request, jsonify, abort
from .cameras_service import CameraService
import json


class CameraController:
    @staticmethod
    def get_cameras():
        """
        Get a list of all cameras.

        Returns:
            Response: JSON list of cameras.
        """
        return CameraService.get_cameras()

    @staticmethod
    def locations():
        """
        Get a list of unique camera locations.

        Returns:
            Response: JSON list of locations.
        """
        return CameraService.locations()

    @staticmethod
    def cameraID_by_location(location):
        """
        Get camera IDs by a specific location.

        Parameters:
            location (str): The location to filter cameras.

        Returns:
            Response: JSON list of camera IDs.
        """
        return CameraService.cameraID_by_location(location)

    @staticmethod
    def get_camera(camera_id):
        """
        Get details of a specific camera.

        Parameters:
            camera_id (str): The ID of the camera.

        Returns:
            Response: JSON with camera details or 404 error if not found.
        """

        camera_data = CameraService.get_camera_by_id(camera_id)

        if camera_data:
            return jsonify(camera_data), 200
        else:
            abort(404, description="Camera not found")

    @staticmethod
    def set_confidence(camera_id, confidence):
        """
        Set the confidence threshold for a specific camera.

        Parameters:
            camera_id (str): The ID of the camera.
            confidence (float): The confidence threshold to set.

        Returns:
            Response: JSON indicating success or failure.
        """
        return CameraService.set_confidence(camera_id, confidence)

    @staticmethod
    def get_confidence_threshold(camera_id):
        """
        Get the confidence threshold for a specific camera.

        Parameters:
            camera_id (str): The ID of the camera.

        Returns:
            Response: JSON with the confidence threshold or 404 error if not found.
        """
        confidence_threshold = CameraService.get_confidence_threshold_by_id(camera_id)

        if confidence_threshold is not None:
            return jsonify({"confidence_threshold": confidence_threshold}), 200
        else:
            abort(404, description="Camera not found")

    @staticmethod
    def update_confidence(camera_id):
        """
        Update the confidence threshold for a specific camera.

        Returns:
            Response: JSON indicating success or failure.
        """
        data = request.json
        confidence = data.get("confidence")

        if confidence is not None:
            return CameraService.update_confidence(camera_id, confidence)
        else:
            return jsonify({"error": "Confidence value is required"}), 400

    @staticmethod
    def update_ip(camera_id):
        """
        Update the IP address of a specific camera.

        Returns:
            Response: JSON indicating success or failure.
        """
        data = request.json
        ip_address = data.get("ip_address")

        if ip_address is not None:
            return CameraService.update_ip(camera_id, ip_address)
        else:
            return jsonify({"error": "IP address is required"}), 400

    @staticmethod
    def update_location(camera_id):
        """
        Update the location of a specific camera.

        Returns:
            Response: JSON indicating success or failure.
        """
        data = request.json
        location = data.get("location")

        if not location:
            return jsonify({"error": "Location value is required"}), 400

        return CameraService.update_location(camera_id, location)

    @staticmethod
    def process_camera_data():
        """
        Process uploaded camera data.

        Returns:
            Response: JSON with the received data or a failure message.
        """
        data = request.json
        topic = data.get("topic")
        source = data.get("source")
        time = data.get("time")
        object_type = data.get("object_type")
        score = data.get("score")

        if data:
            return (
                jsonify(
                    {
                        "message": "Received data",
                        "topic": topic,
                        "source": source,
                        "time": time,
                        "type": object_type,
                        "score": score,
                    }
                ),
                201,
            )
        return (jsonify({"message": "No data received"}),)

    @staticmethod
    def update_schedule(camera_id):
        """
        Update the schedule of a specific camera.

        Returns:
            Response: JSON indicating success or failure.
        """
        data = request.json
        schedule = data.get("schedule")

        if schedule is not None:
            schedule = json.dumps(schedule)
            return CameraService.update_schedule(camera_id, schedule)
        else:
            return jsonify({"error": "Schedule value is required"}), 400
