from app.models import *
from flask import jsonify
from .alarms_service import AlarmService

# will request entered data, tries the calls and returns the results


class AlarmController:
    def get_alarms():
        #        alarms = Alarm.query.all()
        #        return [{
        #            "id": alarm.id,
        #            "camera_id": alarm.camera_id,
        #            "confidence_score": alarm.confidence_score,
        #            "timestamp": alarm.timestamp,
        #            "image_snapshot_id": alarm.image_snapshot_id,
        #            "video_clip_id": alarm.video_clip_id,
        #            "status": alarm.status,
        #            "operator_id": alarm.operator_id
        #        } for alarm in alarms]
        return jsonify({"message": "get all alarms"})

    def add_alarm():
        return AlarmService.add_alarm()

    def get_alarm_by_id(alarm_id):
        #        alarm = Alarm.query.get(alarm_id)
        #       if alarm:
        #            return {
        #                "id": alarm.id,
        #                "camera_id": alarm.camera_id,
        #                "confidence_score": alarm.confidence_score,
        #                "timestamp": alarm.timestamp,
        #                "image_snapshot_id": alarm.image_snapshot_id,
        #                "video_clip_id": alarm.video_clip_id,
        #                "status": alarm.status,
        #                "operator_id": alarm.operator_id
        #        }
        #        else:
        #            return None
        return jsonify({"alarm_id": str(alarm_id)})

    def delete_alarm_by_id(alarm_id):
        return AlarmService.delete_alarm_by_id(alarm_id)
