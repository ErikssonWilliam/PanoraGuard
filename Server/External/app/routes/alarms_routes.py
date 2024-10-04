from flask import jsonify, Blueprint
from ..controllers.alarms_controller import AlarmController

alarms_bp = Blueprint("alarms", __name__)