import schedule
import time
from datetime import datetime, date
from collections import namedtuple
import json
import requests
from requests.auth import HTTPBasicAuth

# mockdata
Camera = namedtuple("Camera", ["ip_address", "schedule"])
week = {
    "week": {
        "Monday": [
            1,
            0,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            1,
            1,
            0,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            1,
            1,
            0,
        ],
        "Tuesday": [
            0,
            1,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            0,
            1,
        ],
        "Wednesday": [
            1,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
        ],
        "Thursday": [
            0,
            1,
            1,
            1,
            0,
            1,
            0,
            1,
            1,
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            1,
            0,
        ],
        "Friday": [
            1,
            0,
            1,
            1,
            1,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
        ],
        "Saturday": [
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            1,
            0,
            1,
            0,
            1,
            1,
            0,
            0,
        ],
        "Sunday": [
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            1,
            0,
            1,
            0,
            1,
            1,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            0,
            1,
            1,
        ],
    }
}

week2 = {
    "week": {
        "Monday": [
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            0,
            0,
            1,
            1,
            1,
            0,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            1,
            1,
            0,
        ],
        "Tuesday": [
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            0,
            1,
        ],
        "Wednesday": [
            1,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
        ],
        "Thursday": [
            0,
            1,
            1,
            1,
            0,
            1,
            0,
            1,
            1,
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            1,
            0,
        ],
        "Friday": [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        "Saturday": [
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        "Sunday": [
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            0,
            1,
            0,
            1,
            0,
            1,
            1,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            0,
            1,
            1,
        ],
    }
}

camera1 = Camera("123", json.dumps(week))
camera2 = Camera("987", json.dumps(week2))
camera_list = [camera1, camera2]
# end of mock data
#-------------------------------------------------------------------------------------------
#constants
acap_name = "alarm_identifier"

#TODO check if toggle_acap work as intended, cameras needed
def toggle_acap(camera_ip, action):
    url = f"http://{camera_ip}/axis-cgi/applications/control.cgi?action={action}&package={acap_name}"
    try:
        response = requests.post(url, auth=HTTPBasicAuth("root", "secure")) 
        # response = requests.post(url, data=client_data, auth=HTTPBasicAuth(username, password), stream=True)

        if response.status_code == 200:
            return True
        else:
            print("Request failed: " + response.text)
            return False
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return False

def check_schedules():
    today = date.today().strftime("%A")
    current_time = datetime.now().strftime("%H:%M:%S")
    print("Weekday:", today, ". Current time:", current_time)

    """  
    TODO replace camera_list mock data with actual cameras from DB
    either call the route in external server, but unneccesary to call a route 
    since we have access to the db?
    or make a query from DB 
    
    TODO add schedule element to camera table in DB
    """

    for camera in camera_list: 

        if not camera.schedule:
            print("Camera dosent have a schedule assigned to it")
            continue

        schedule = json.loads(camera.schedule)
        index = datetime.now().hour
        shedule_today = schedule["week"][today]
        isScheduled =  shedule_today[index]

        state = "ON" if isScheduled else "OFF" # Determine state for logging
        print(f"ACAP should be turned {state} for camera ip: {camera.ip_address}")

        action = True if isScheduled else False #TODO what is the action parameter supposed to be in the request?
        toggle_acap(camera.ip_address, action)


schedule.every(1).minute.do(check_schedules)

def shedule():
    #TODO bug fix: the loop starts at each new minute, but it skips the first minute
    while True:
        seconds_until_next_minute = 60 - datetime.now().second
        print("Sleeping for: " + str(seconds_until_next_minute))
        time.sleep(
            seconds_until_next_minute
        )  # Wait until the next minute starts (at :00 seconds)

        schedule.run_pending()

if __name__ == "__main__":
    shedule()
