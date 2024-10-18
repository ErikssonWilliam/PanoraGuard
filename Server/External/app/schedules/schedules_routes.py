from flask import Blueprint
from .schedules_controller import ScheduleController

schedules_bp = Blueprint("schedules", __name__)


@schedules_bp.route("/all", methods=["GET"])
def get_schedules():
    return ScheduleController.get_schedules()


@schedules_bp.route("/add", methods=["POST"])
def add_schedule():
    return ScheduleController.add_schedule()


@schedules_bp.route("/<string:schedule_id>", methods=["GET"])
def get_schedule_by_id(snapshot_id):
    return ScheduleController.get_schedule_by_id(snapshot_id)


@schedules_bp.route("/<string:schedule_id>", methods=["DELETE"])
def delete_schedule_by_id(snapshot_id):
    return ScheduleController.delete_schedule_by_id(snapshot_id)
