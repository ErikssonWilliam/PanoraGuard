# logic
from app.extensions import db
from flask import jsonify
from app.models import Camera
from typing import List


class CameraService:
    def add_camera():
        return  # add logic

    def get_cameras() -> List[Camera]:
        cameras = Camera.query.all()
        return [camera.to_dict() for camera in cameras]

    def get_camera_by_id(camera_id):
        return  # add logic

    def set_confidence(camera_id, confidence):
        camera = Camera.query.filter_by(id=camera_id).first()
        if not camera:
            return jsonify({"status": "No camera found"}), 404

        camera.confidence_threshold = confidence
        db.session.commit()
        return "success"

    def delete_camera_by_id(camera_id):
        return  # add logic

    def process_camera_data(topic, source, time, type, score):
        return
