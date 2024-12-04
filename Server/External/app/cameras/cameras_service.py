"""
This file defines the CameraService class, responsible for managing camera-related operations.
It interacts with the database models to retrieve data, and manage camera configurations such
as confidence thresholds, locations, schedules, and IP addresses.
"""

from app.extensions import db
from flask import jsonify
from app.models import Camera
from typing import List
import json


class CameraService:
    @staticmethod
    def get_cameras() -> List[dict]:
        """
        Retrieve all cameras and their details from the database.

        Returns:
            Response: JSON list of cameras with their details, including parsed schedules.
        """
        cameras = Camera.query.all()
        cameras_list = []

        for camera in cameras:
            camera_dict = camera.to_dict()

            # Parse schedule if present and valid; otherwise, initialize to empty dict.
            if camera_dict["schedule"]:
                try:
                    camera_dict["schedule"] = json.loads(camera_dict["schedule"])
                except json.JSONDecodeError:
                    camera_dict["schedule"] = {}
            else:
                camera_dict["schedule"] = {}

            cameras_list.append(camera_dict)

        return jsonify(cameras_list)

    @staticmethod
    def locations() -> List[dict]:
        """
        Retrieve distinct locations from all cameras.

        Returns:
            List[dict]: A list of locations.
        """
        locations = db.session.query(Camera.location).distinct().all()
        return [{"location": location[0]} for location in locations]

    @staticmethod
    def cameraID_by_location(location: str) -> List[dict]:
        """
        Retrieve camera IDs by a specific location.

        Parameters:
            location (str): The location to filter cameras.

        Returns:
            List[dict]: A list of camera IDs for the specified location.
        """
        camera_ids = (
            db.session.query(Camera.id).filter(Camera.location == location).all()
        )
        return [{"id": str(camera_id[0])} for camera_id in camera_ids]

    @staticmethod
    def get_camera_by_id(camera_id):
        """
            Retrieve a camera by its ID.

        Parameters:
            camera_id (string): The ID of the camera.

        Returns:
            dict or None: The camera's details if found, or None if not found.
        """
        try:
            camera = Camera.query.get(camera_id)
            if camera:
                camera_dict = camera.to_dict()
                # Check if 'schedule' exists and handle accordingly
                if "schedule" in camera_dict and camera_dict["schedule"]:
                    camera_dict["schedule"] = json.loads(camera_dict["schedule"])
                else:
                    camera_dict["schedule"] = (
                        ""  # Default to an empty string if not present
                    )
                return camera_dict
            return None
        except Exception as e:
            print("Error in CameraService.get_camera_by_id:", e)
            return None

    @staticmethod
    def set_confidence(camera_id, confidence):
        """
        Set the confidence threshold for a camera.

        Parameters:
            camera_id (string): The ID of the camera.
            confidence (float): The confidence threshold to set.

        Returns:
            Response: JSON indicating success or failure.
        """
        camera = Camera.query.filter_by(id=camera_id).first()
        if not camera:
            return jsonify({"status": "No camera found"}), 404
        try:
            camera.confidence_threshold = float(confidence)
            db.session.commit()
            return (
                jsonify({"status": "success", "confidence_threshold": confidence}),
                200,
            )
        except Exception as e:
            print("Error in CameraService.set_confidence:", e)
            return jsonify({"status": "error", "message": str(e)}), 500

    @staticmethod
    def update_confidence(camera_id, confidence):
        """
        Update the confidence threshold of a camera.

        Parameters:
            camera_id (string): The ID of the camera.
            confidence (float): The new confidence threshold.

        Returns:
            Response: JSON indicating success or failure.
        """

        camera = Camera.query.get(camera_id)

        if not camera:
            return jsonify({"error": "Camera was not found"}), 404

        try:
            camera.confidence_threshold = float(confidence)
            db.session.commit()
            return (
                jsonify(
                    {
                        "message": "Confidence threshold updated successfully",
                        "confidence_threshold": camera.confidence_threshold,
                    }
                ),
                200,
            )
        except Exception as e:
            print("Error in CameraService.update_confidence:", e)
            return jsonify({"error": "Failed to update confidence threshold"}), 500

    @staticmethod
    def update_location(camera_id, location):
        """
        Update the location of a camera.

        Parameters:
            camera_id (string): The ID of the camera.
            location (str): The new location to set.

        Returns:
            Response: JSON indicating success or failure.
        """
        camera = Camera.query.get(camera_id)

        if not camera:
            return jsonify({"error": "Camera not found"}), 404

        try:
            camera.location = location
            db.session.commit()

            return (
                jsonify(
                    {
                        "message": "Location updated successfully",
                        "location": camera.location,
                    }
                ),
                200,
            )
        except Exception:
            return jsonify({"error": "Failed to update location"}), 500

    @staticmethod
    def get_confidence_threshold_by_id(camera_id):
        """
        Retrieve the confidence threshold of a camera by its ID.

        Parameters:
            camera_id (string): The ID of the camera.

        Returns:
            float or None: The confidence threshold if found, or None if not.
        """
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
        """
        Update the IP address of a camera.

        Parameters:
            camera_id (string): The ID of the camera.
            ip_address (str): The new IP address to set.

        Returns:
            Response: JSON indicating success or failure.
        """
        camera = Camera.query.get(camera_id)

        if not camera:
            return jsonify({"error": "Camera not found"}), 404

        try:
            camera.ip_address = ip_address
            db.session.commit()

            return (
                jsonify(
                    {
                        "message": "IP address updated successfully",
                        "ip_address": camera.ip_address,
                    }
                ),
                200,
            )
        except Exception as e:
            print("Error in CameraService.update_ip:", e)
            return jsonify({"error": "Failed to update IP address"}), 500

    @staticmethod
    def update_schedule(camera_id, schedule):
        """
        Update the schedule of a camera.

        Parameters:
            camera_id (string): The ID of the camera.
            schedule (str): The new schedule in JSON format.

        Returns:
            Response: JSON indicating success or failure.
        """
        camera = Camera.query.get(camera_id)

        if not camera:
            return jsonify({"error": "Camera not found"}), 404

        try:
            print(schedule)
            camera.schedule = schedule
            db.session.commit()

            return (
                jsonify(
                    {
                        "message": "Schedule updated successfully",
                        "schedule": camera.schedule,
                    }
                ),
                200,
            )
        except Exception as e:
            print("Error in CameraService.update_schedule:", e)
            return jsonify({"error": "Failed to update schedule"}), 500
