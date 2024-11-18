from flask import Blueprint
from .alarms_controller import AlarmController

alarms_bp = Blueprint("alarms", __name__)


# Get all alarms


@alarms_bp.route("/", methods=["GET"])
def get_alarms():
    return AlarmController.get_alarms()


@alarms_bp.route("/type/<string:type>", methods=["GET"])
def get_active_alarms(type):
    return AlarmController.get_active_alarms(type)


@alarms_bp.route("/<string:alarm_ID>/image", methods=["GET"])
def get_alarm_image(alarm_ID):
    return AlarmController.get_alarm_image(alarm_ID)


@alarms_bp.route("/notify/<string:guard_ID>/<string:alarm_ID>", methods=["POST"])
# Notify guard, works with guard id = 35ad0eab-2347-404e-a833-d8b2fb0367ff,
# alarm id = cc006a17-0852-4e0e-b13c-36e4092f767d
def notify_guard(guard_ID, alarm_ID):
    return AlarmController.notify_guard(guard_ID, alarm_ID)


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
    # ToDO: Extract operator id from frontend token request, and update operate_id in the alarm
    return AlarmController.update_alarm_status(alarm_id)
