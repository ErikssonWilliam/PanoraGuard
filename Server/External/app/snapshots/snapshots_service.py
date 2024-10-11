#logic
from app.models import *
import base64
import os
import shutil

UPLOAD_FOLDER = './test_snapshots_output'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    print("Created folder: " + UPLOAD_FOLDER)

class SnapshotService:

    def get_snapshots():
        return #add logic
    
    def upload_snapshot(snapshot):
        try:
            snapshot_data = SnapshotService.base64_padding(snapshot)
            snapshot_binary = base64.b64decode(snapshot_data)

            # if meets_critera(snapshot_binary):
            #     store_snapshot_on_cloud(snapshot_binary)

            file_path = os.path.join(UPLOAD_FOLDER, "snapshottest.png")

            with open(file_path, 'wb') as image_file:
                image_file.write(snapshot_binary)

            return file_path

        except Exception as e:
            raise Exception(f"Failed to save snapshot: {str(e)}")
    
    def get_snapshot_by_id(snapshot_id):
        return #add logic
    
    def delete_snapshot_by_id(snapshot_id):
        return #add logic

    def meets_critera(snapshot):
        return #add logic
    
    def store_snapshot_on_cloud(snapshot):
        return #add logic
    
    def base64_padding(snapshot):
        missing_padding = len(snapshot) % 4
        if missing_padding:
            snapshot += '=' * (4 - missing_padding)
        return snapshot