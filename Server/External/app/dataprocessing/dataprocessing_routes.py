from flask import Blueprint
from .dataprocessing_controller import DataprocessingController

processing = Blueprint("processing", __name__)


@processing.route("/camera/data_JSON", methods=["POST"])
def receive_data():
    return DataprocessingController.processData()
