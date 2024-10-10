from flask import Blueprint
from .snapshots_controller import SnapshotController

snaphots_bp = Blueprint("snaphots", __name__)

@snaphots_bp.route("/", methods=["GET"])
def get_snapshots():
    return SnapshotController.get_snapshots()

@snaphots_bp.route("/add", methods=["POST"])
def add_snapshot():
    return SnapshotController.add_snapshot()

@snaphots_bp.route("/<string:snapshot_id>", methods=["GET"])
def get_snapshot_by_id(snapshot_id):
    return SnapshotController.get_snapshot_by_id(snapshot_id)

@snaphots_bp.route("/<string:snapshot_id>", methods=["DELETE"])
def delete_snapshot_by_id(snapshot_id):
    return SnapshotController.delete_snapshot_by_id(snapshot_id)