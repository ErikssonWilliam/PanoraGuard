from flask import Blueprint, request, jsonify
from .models import *
from .database import db
import requests
from requests.auth import HTTPBasicAuth
from apscheduler.schedulers.background import BackgroundScheduler

api = Blueprint("api", __name__)
    

# AXIS device credentials
username = "root"
password = "secure"


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
    external_url = "http://192.168.1.121/axis-cgi/opticscontrol.cgi" # Replace with actual external address

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



# Function to enable ACAP
def enable_acap(url):
    
    try:
        response = requests.post(url, auth=HTTPBasicAuth(username, password))
        # response = requests.post(url, data=client_data, auth=HTTPBasicAuth(username, password), stream=True)
    
        if response.status_code == 200:
            return {"status": "success", "message": f"ACAP enabled successfully"}
        else:
            return {"status": "failed", "error": response.text}
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return {"status": "failed", "error": str(e)}


# Function to disable ACAP
def disable_acap(url):

    try:
        response = requests.post(url, auth=HTTPBasicAuth(username, password))
    
        if response.status_code == 200:
            return {"status": "success", "message": f"ACAP disabled successfully"}
        else:
            return {"status": "failed", "error": response.text}
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return {"status": "failed", "error": str(e)}   




@api.route("/schedule-acap", methods=["GET"])
def schedule_acap():
    # Extract JSON data from the incoming request
    #client_data = request.get_json()

    # Camera details
    camera_ip = "192.168.1.121"
    acap_name = "consolidated_jansson"

    
    # Define the external URL
    url = f"http://{camera_ip}/axis-cgi/applications/control.cgi?action=stop&package={acap_name}"

    
    try:

        #result = disable_acap(url)

        scheduler = BackgroundScheduler()
        scheduler.add_job(enable_acap, 'cron', hour=11, minute=37, args=[url])  
        scheduler.add_job(disable_acap, 'cron', hour=11, minute=38, args=[url])  
        scheduler.start()


        return jsonify({"status": "success", "message": f"ACAP scheduling set for {acap_name} from 11:00 to 11:05 daily"}), 200
    except Exception as e:
        return jsonify({"status": "failed", "error": str(e)}), 500   


