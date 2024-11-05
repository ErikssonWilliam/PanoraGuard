from app.models import *
from flask import request, jsonify
from .cameras_service import CameraService

# will request entered data, tries the calls and returns the results


class CameraController:
    def get_cameras():
        return CameraService.get_cameras()

    def add_camera():
        return CameraService.add_camera()

    def get_camera(camera_id):
        return CameraService.get_camera(camera_id)

    def delete_camera(camera_id):
        return CameraService.delete_camera(camera_id)
    
    def process_camera_data():
        data = request.json

#       recieved_data = CameraService.process_camera_data(

        topic=data["topic"],
        source=data["source"],
        time=data["time"],
        object_type=data["object_type"],
        score=data["score"]
#        )

        if data:
            print(f"Received data: Topic={topic}, Source={source}, Time={time}, Type={object_type}, Score={score}")
            return (
                jsonify({"message" : "Recieved data", "topic" : topic, "source": source, "time": time, "type": object_type, "score": score}),
                201,
            )
        return jsonify({"message": "No data recieved"}), 404
