from flask import Blueprint, request, jsonify
from .models import *
from .database import db

api = Blueprint("api", __name__)


@api.route("/test", methods=["GET"])
def get_tests():
    tests = Test.query.all()
    return jsonify([test.id for test in tests])

@api.route("/", methods=["GET"])
def hello_world():
    return "Hello World"
