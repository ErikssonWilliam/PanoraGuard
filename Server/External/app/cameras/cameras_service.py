# CameraService.py
from app.extensions import db
from flask import jsonify
from app.models import Camera
from typing import List


class CameraService:
    @staticmethod
    def add_camera():
        # Placeholder logic, complete as necessary
        return jsonify({"message": "Add camera functionality not implemented"}), 501

    @staticmethod
    def get_cameras() -> List[dict]:
        cameras = Camera.query.all()
        return [camera.to_dict() for camera in cameras]

    @staticmethod
    def locations() -> List[dict]:
        locations = db.session.query(Camera.location).distinct().all()
        return [{"location": location[0]} for location in locations]

    @staticmethod
    def cameraID_by_location(location: str) -> List[dict]:
        camera_ids = (
            db.session.query(Camera.id).filter(Camera.location == location).all()
        )
        return [{"id": str(camera_id[0])} for camera_id in camera_ids]

    @staticmethod
    def get_camera_by_id(camera_id):
        try:
            camera = Camera.query.get(camera_id)
            if camera:
                return camera.to_dict()
            return None
        except Exception as e:
            print("Error in CameraService.get_camera_by_id:", e)
            return None

    @staticmethod
    def set_confidence(camera_id, confidence):
        camera = Camera.query.filter_by(id=camera_id).first()
        if not camera:
            return jsonify({"status": "No camera found"}), 404
        try:
            camera.confidence_threshold = float(confidence)
            db.session.commit()
            return jsonify(
                {"status": "success", "confidence_threshold": confidence}
            ), 200
        except Exception as e:
            print("Error in CameraService.set_confidence:", e)
            return jsonify({"status": "error", "message": str(e)}), 500

    @staticmethod
    def delete_camera_by_id(camera_id):
        # Placeholder logic, complete as necessary
        return jsonify({"message": "Delete camera functionality not implemented"}), 501

    @staticmethod
    def update_confidence(camera_id, confidence):
        camera = Camera.query.get(camera_id)

        if not camera:
            return jsonify({"error": "Camera was not found"}), 404

        try:
            # Update and save confidence threshold
            camera.confidence_threshold = float(confidence)
            db.session.commit()
            return jsonify(
                {
                    "message": "Confidence threshold updated successfully",
                    "confidence_threshold": camera.confidence_threshold,
                }
            ), 200
        except Exception as e:
            print("Error in CameraService.update_confidence:", e)
            return jsonify({"error": "Failed to update confidence threshold"}), 500

    @staticmethod
    def update_location(camera_id, location):
        # Fetch the camera object
        camera = Camera.query.get(camera_id)

        if not camera:
            return jsonify({"error": "Camera not found"}), 404

        try:
            # Update the location
            camera.location = location
            db.session.commit()  # Commit changes to the database

            # Return a success response
            return jsonify(
                {
                    "message": "Location updated successfully",
                    "location": camera.location,
                }
            ), 200
        except Exception as e:
            # Log the exception for debugging
            print("Error in CameraService.update_location:", e)
            return jsonify({"error": "Failed to update location"}), 500

    @staticmethod
    def get_confidence_threshold_by_id(camera_id):
        try:
            camera = Camera.query.get(camera_id)
            if camera:
                return camera.confidence_threshold
            return None
        except Exception as e:
            print("Error in CameraService.get_confidence_threshold_by_id:", e)
            return None

    @staticmethod
    def update_ip(camera_id, ip_address):
        camera = Camera.query.get(camera_id)

        if not camera:
            return jsonify({"error": "Camera not found"}), 404

        try:
            # Update the IP address
            camera.ip_address = ip_address
            db.session.commit()  # Save changes to the database

            return jsonify(
                {
                    "message": "IP address updated successfully",
                    "ip_address": camera.ip_address,
                }
            ), 200
        except Exception as e:
            print("Error in CameraService.update_ip:", e)
            return jsonify({"error": "Failed to update IP address"}), 500

    @staticmethod
    def update_schedule(camera_id, schedule):
        # Fetch the camera object by ID
        camera = Camera.query.get(camera_id)

        if not camera:
            return jsonify({"error": "Camera not found"}), 404

        try:
            # Update the schedule attribute (it can be None initially)
            camera.schedule = schedule
            db.session.commit()  # Commit changes to the database

            return jsonify(
                {
                    "message": "Schedule updated successfully",
                    "schedule": camera.schedule,
                }
            ), 200
        except Exception as e:
            print("Error in CameraService.update_schedule:", e)
            return jsonify({"error": "Failed to update schedule"}), 500
