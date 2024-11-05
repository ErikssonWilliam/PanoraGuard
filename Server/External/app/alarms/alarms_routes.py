from flask import Blueprint
from .alarms_controller import AlarmController

alarms_bp = Blueprint("alarms", __name__)

# Get all alarms
@alarms_bp.route("/", methods=["GET"])
def get_alarms():
    return AlarmController.get_alarms()

# # Get latest alarm
# @alarms_bp.route("/new", methods=["GET"])
# def get_new_alarm():
#     return AlarmController.get_new_alarm()

# Add alarm
@alarms_bp.route("/add", methods=["POST"])
def add_alarm():
    return AlarmController.add_alarm()

# Get alarm by id
@alarms_bp.route("/<string:alarm_id>", methods=["GET"])
def get_alarm_by_id(alarm_id):
    return AlarmController.get_alarm_by_id(alarm_id)

# Delete alarm by id
@alarms_bp.route("/<string:alarm_id>", methods=["DELETE"])
def delete_alarm_by_id(alarm_id):
    return AlarmController.delete_alarm_by_id(alarm_id)

# Update alarm status by id
@alarms_bp.route("/<string:alarm_id>/status", methods=["PUT"])
def update_alarm_status(alarm_id):
    return AlarmController.update_alarm_status(alarm_id)
