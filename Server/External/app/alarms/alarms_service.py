# logic
from app.models import *
from typing import List


class AlarmService:
    def get_alarms() -> List[Alarm]:     
        return Alarm.query.all()

    def add_alarm():
        return  # add logic

    def get_alarm_by_id(schedule_id):
        return  # add logic

    def delete_alarm_by_id(schedule_id):
        #    alarm = AlarmController.get_alarm_by_id(alarm_id)
        #    if alarm:
        #        return jsonify(alarm)
        #    else:
        #        return jsonify({"message": "Alarm not found"})
        #        return jsonify({"alarm_id": str(alarm_id)})
        return  # add logic
