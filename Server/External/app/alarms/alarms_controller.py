from app.models import *
from flask import jsonify
from .alarms_service import AlarmService

# Will request entered data, tries the calls and returns the results


class AlarmController:
    def get_alarms():
        return jsonify(AlarmService.get_alarms())

    def add_alarm():
        alarm_data = request.get_json()
        new_alarm = AlarmService.create_alarm(alarm_data)
        return jsonify(new_alarm), 201

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
