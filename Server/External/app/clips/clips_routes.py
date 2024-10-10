from flask import Blueprint
from .clips_controller import ClipController

clips_bp = Blueprint("clips", __name__)

clips_bp.route("/", methods=["GET"])
def get_clips():
    return ClipController.get_clips()

clips_bp.route("/add", methods=["POST"])
def add_clip():
    return ClipController.add_clip()

clips_bp.route("/<string:clip_id>", methods=["GET"])
def get_clip_by_id(clip_id):
    return ClipController.get_clip_by_id(clip_id)

clips_bp.route("/<string:clip_id>", methods=["DELETE"])
def delete_clip_by_id(clip_id):
    return ClipController.delete_clip_by_id(clip_id)