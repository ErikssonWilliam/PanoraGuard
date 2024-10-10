from app.models import *
from flask import jsonify
from .snapshots_service import SnapshotService

#will request entered data, tries the calls and returns the results

class SnapshotController:
    def get_snapshots():
        return SnapshotService.get_snapshots()
    
    def add_snapshot():
        return SnapshotService.add_snapshot()
    
    def get_snapshot_by_id(snapshot_id):
        return SnapshotService.get_snapshot_by_id(snapshot_id)
    
    def delete_snapshot_by_id(snapshot_id):
        return SnapshotService.delete_snapshot_by_id(snapshot_id)