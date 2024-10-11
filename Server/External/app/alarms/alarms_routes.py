from flask import Blueprint
from .alarms_controller import AlarmController

alarms_bp = Blueprint("alarms", __name__)


@alarms_bp.route("/", methods=["GET"])
def get_alarms():
    return AlarmController.get_alarms()


@alarms_bp.route("/add", methods=["POST"])
def AlarmController():
    return AlarmController.add_alarm()


@alarms_bp.route("/<string:alarm_id>", methods=["GET"])
def get_alarm_by_id(alarm_id):
    return AlarmController.get_alarm_by_id(alarm_id)


@alarms_bp.route("/<string:alarm_id>", methods=["DELETE"])
def delete_alarm_by_id(alarm_id):
    return AlarmController.delete_alarm_by_id(alarm_id)
