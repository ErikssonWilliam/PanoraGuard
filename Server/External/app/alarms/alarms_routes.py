from flask import jsonify, Blueprint
from .alarms_controller import AlarmController

alarms_bp = Blueprint("alarms", __name__)

@alarms_bp.route("/", methods=["GET"])
def get_alarms():
#    alarms = AlarmController.get_all_alarms()
#    return jsonify(alarms) 
 return 'all alarms'

@alarms_bp.route("/<string:alarm_id>", methods=["GET"])
def get_arm_by_id(alarm_id):
#    alarm = AlarmController.get_alarm_by_id(alarm_id)
#    if alarm:
#        return jsonify(alarm)
#    else:
#        return jsonify({"message": "Alarm not found"})
 return jsonify({"alarm_id": str(alarm_id)})