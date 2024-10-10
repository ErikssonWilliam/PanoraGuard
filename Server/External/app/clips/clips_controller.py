from app.models import *
from flask import jsonify
from .clips_service import ClipService

#will request entered data, tries the calls and returns the results

class ClipController:
    def get_clips():
        return ClipService.get_clips()
    
    def add_clip():
        return ClipService.add_clip()
    
    def get_clip_by_id():
        return ClipService.get_clip_by_id()
    
    def delete_clip():
        return ClipService.delete_clip()