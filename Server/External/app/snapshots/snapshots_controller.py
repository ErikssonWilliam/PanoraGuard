from app.models import *
from flask import jsonify, request
from .snapshots_service import SnapshotService


#will request entered data, tries the calls and returns the results

class SnapshotController:

    def get_snapshots():
        return SnapshotService.get_snapshots()
    
    def upload_snapshot():
        try:
            data = request.json

            if not data:
                return jsonify({"message": "No data provided"}), 400

            if not 'snapshot' in data:
                return jsonify({"message": "No snapshot provided"}), 400

            snapshot = data["snapshot"]

            file_path = SnapshotService.upload_snapshot(snapshot)

            return jsonify({"message": "Snapshot uploaded", "dir": file_path}), 201
    
        except Exception as e:
            return jsonify({"message": str(e)}), 500
    
    def get_snapshot_by_id(snapshot_id):        
        return SnapshotService.get_snapshot_by_id(snapshot_id)

    def delete_snapshot_by_id(snapshot_id):
        return SnapshotService.delete_snapshot_by_id(snapshot_id)
