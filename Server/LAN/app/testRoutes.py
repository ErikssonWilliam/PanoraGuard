from flask import Blueprint, request, jsonify
from .models import *
from .database import db
import requests
from requests.auth import HTTPBasicAuth

api = Blueprint("api", __name__)
    


@api.route("/test-supported-api-version", methods=["GET"])
def api_version():
    # Extract JSON data from the incoming request
    #client_data = request.get_json()

    client_data = {
        "context": "my context",
        "method": "getSupportedVersions"
    }
    
    # Define the external URL
    external_url = "http://192.168.1.116/axis-cgi/lightcontrol.cgi" # Replace with actual external address

    # AXIS device credentials
    username = "root"
    password = "secure"
    
    # Send POST request to the external server
    response = requests.post(external_url, json=client_data, auth=HTTPBasicAuth(username, password))
    
    # Handle the response from the external server
    if response.status_code == 200:
        return jsonify({"status": "success", "external_response": response.json()}), 200
    else:
        return jsonify({"status": "failed", "error": response.text}), response.status_code
    


@api.route("/test-lightcontrol", methods=["GET"])
def light_control():
    # Extract JSON data from the incoming request
    #client_data = request.get_json()

    client_data = {
  "apiVersion": "1.0",
  "context": "my context",
  "method": "getLightInformation",
  "params": {
  }
}
    
    # Define the external URL
    external_url = "http://192.168.1.116/axis-cgi/lightcontrol.cgi" # Replace with actual external address

    # AXIS device credentials
    username = "root"
    password = "secure"
    
    # Send POST request to the external server
    response = requests.post(external_url, json=client_data, auth=HTTPBasicAuth(username, password))
    
    # Handle the response from the external server
    if response.status_code == 200:
        return jsonify({"status": "success", "external_response": response.json()}), 200
    else:
        return jsonify({"status": "failed", "error": response.text}), response.status_code



@api.route("/get-optics-info", methods=["GET"])
def optics_info():
    # Extract JSON data from the incoming request
    #client_data = request.get_json()

    client_data = {
  "apiVersion": "1.1",
  "context": "abc",
  "method": "getOptics"
}
    
    # Define the external URL
    external_url = "http://192.168.1.116/axis-cgi/opticscontrol.cgi" # Replace with actual external address

    # AXIS device credentials
    username = "root"
    password = "secure"
    
    # Send POST request to the external server
    response = requests.post(external_url, json=client_data, auth=HTTPBasicAuth(username, password))
    
    # Handle the response from the external server
    if response.status_code == 200:
        return jsonify({"status": "success", "external_response": response.json()}), 200
    else:
        return jsonify({"status": "failed", "error": response.text}), response.status_code



@api.route("/set-magnification", methods=["GET"])
def set_magnification():
    # Extract JSON data from the incoming request
    #client_data = request.get_json()

    client_data = {
  "apiVersion": "1.1",
  "context": "abc",
  "method": "setMagnification",
  "params": {
    "optics": [
      {
        "opticsId": "0",
        "magnification": 1.0
      }
    ]
  }
}
    
    # Define the external URL
    external_url = "http://192.168.1.116/axis-cgi/opticscontrol.cgi" # Replace with actual external address

    # AXIS device credentials
    username = "root"
    password = "secure"
    
    # Send POST request to the external server
    response = requests.post(external_url, json=client_data, auth=HTTPBasicAuth(username, password))
    
    # Handle the response from the external server
    if response.status_code == 200:
        return jsonify({"status": "success", "external_response": response.json()}), 200
    else:
        return jsonify({"status": "failed", "error": response.text}), response.status_code


