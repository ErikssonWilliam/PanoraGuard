from app.models import Alarm

class AlarmController:

    def get_all_alarms():
        alarms = Alarm.query.all()
        return [{
            "id": alarm.id,
            "camera_id": alarm.camera_id,
            "confidence_score": alarm.confidence_score,
            "timestamp": alarm.timestamp,
            "image_snapshot_id": alarm.image_snapshot_id,
            "video_clip_id": alarm.video_clip_id,
            "status": alarm.status,
            "operator_id": alarm.operator_id	
        } for alarm in alarms] 
    
    def get_alarm_by_id(alarm_id):
        alarm = Alarm.query.get(alarm_id)
        if alarm:
            return {
                "id": alarm.id,
                "camera_id": alarm.camera_id,
                "confidence_score": alarm.confidence_score,
                "timestamp": alarm.timestamp,
                "image_snapshot_id": alarm.image_snapshot_id,
                "video_clip_id": alarm.video_clip_id,
                "status": alarm.status,
                "operator_id": alarm.operator_id
        } 
        else:
            return None