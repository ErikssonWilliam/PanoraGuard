from app.models import *
from flask import jsonify
from .cameras_service import CameraService

#will request entered data, tries the calls and returns the results

class CameraController:
    def get_cameras():
        return CameraService.get_cameras()
    
    def add_camera():
        return CameraService.add_camera()
    
    def get_camera(camera_id):
        return CameraService.get_camera(camera_id)
    
    def delete_camera(camera_id):
        return CameraService.delete_camera(camera_id)