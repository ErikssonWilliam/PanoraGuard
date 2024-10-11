from flask import Blueprint
from .snapshots_controller import SnapshotController

snapshots_bp = Blueprint("snapshots", __name__)


@snapshots_bp.route("/", methods=["GET"])
def get_snapshots():
    return SnapshotController.get_snapshots()


@snapshots_bp.route("/add", methods=["POST"])
def add_snapshot():
    return SnapshotController.add_snapshot()


@snapshots_bp.route("/<string:snapshot_id>", methods=["GET"])
def get_snapshot_by_id(snapshot_id):
    return SnapshotController.get_snapshot_by_id(snapshot_id)


@snapshots_bp.route("/<string:snapshot_id>", methods=["DELETE"])
def delete_snapshot_by_id(snapshot_id):
    return SnapshotController.delete_snapshot_by_id(snapshot_id)
