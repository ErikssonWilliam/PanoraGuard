# CameraController.py
from flask import request, jsonify, abort
from .cameras_service import CameraService


class CameraController:
    @staticmethod
    def get_cameras():
        return CameraService.get_cameras()

    @staticmethod
    def add_camera():
        return CameraService.add_camera()

    @staticmethod
    def get_camera(camera_id):
        # Call the service to get the camera data
        camera_data = CameraService.get_camera_by_id(camera_id)

        # Check if camera data is found and return it, or return a 404 error
        if camera_data:
            return jsonify(camera_data), 200
        else:
            abort(404, description="Camera not found")

    @staticmethod
    def delete_camera(camera_id):
        return CameraService.delete_camera(camera_id)

    @staticmethod
    def set_confidence(camera_id, confidence):
        return CameraService.set_confidence(camera_id, confidence)

    @staticmethod
    def get_confidence_threshold(camera_id):
        # Call the service to get the confidence threshold
        confidence_threshold = CameraService.get_confidence_threshold_by_id(camera_id)

        # Check if the confidence threshold is found, or return a 404 error
        if confidence_threshold is not None:
            return jsonify({"confidence_threshold": confidence_threshold}), 200
        else:
            abort(404, description="Camera not found")

    @staticmethod
    def update_confidence(camera_id):
        data = request.json
        confidence = data.get("confidence")

        # Validate and pass the confidence to the service layer
        if confidence is not None:
            return CameraService.update_confidence(camera_id, confidence)
        else:
            return jsonify({"error": "Confidence value is required"}), 400

    @staticmethod
    def update_location(camera_id):
        data = request.json
        location = data.get("location")

        if not location:
            return jsonify({"error": "Location value is required"}), 400

        return CameraService.update_location(camera_id, location)

    @staticmethod
    def process_camera_data():
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
