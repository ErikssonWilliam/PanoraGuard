import time
from datetime import datetime, date
import json
import requests
from requests.auth import HTTPBasicAuth
from app.utils import get_cameras
from config import Config

# constants
username = Config.CAMERA_USERNAME
password = Config.CAMERA_PASSWORD
acap_name = "alarm_identifier"

acap_states = {}


def toggle_acap(camera_ip, action):
    url = f"http://{camera_ip}/axis-cgi/applications/control.cgi?action={action}&package={acap_name}"
    try:
        response = requests.post(url, auth=HTTPBasicAuth(username, password))

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
    cameras = get_cameras()  # retrive cameras from DB

    for camera in cameras:
        id = camera.get("id")
        schedule = camera.get("schedule")
        if not schedule:
            print("Camera does not have a schedule assigned to it")
            continue

        schedule = json.loads(schedule)

        index = datetime.now().hour
        schedule_today = schedule["week"][today]
        isScheduled = schedule_today[index]

        state = acap_states.get(id, 0)
        if state == isScheduled:
            print("Avoid toggle acap if its the same value")
            continue

        action = "start" if isScheduled == 1 else "stop"
        print("trying to toggle acap to: " + action)
        res = toggle_acap(camera.get("ip_address"), action)

        if res:  # update state if toggle succeded
            print("Toggle succeded")
            acap_states[id] = isScheduled


# TODO Are we going to actually check every minute or only once every hour at minute 00? If we choose the latter, we need to remember to check the schedule of a camera also when that schedule has been changed by the user, so if the user changes the current hour, that change will take effect right away.
def run_schedule(app):
    with app.app_context():
        # Initially for each camera, make sure the ACAP is turned off and the state is set to 0
        cameras = get_cameras()
        for camera in cameras:
            id = camera.get("id")
            res = toggle_acap(camera.get("ip_address"), "stop")

            if res:  # update state if toggle succeded
                print("ACAP successfully stopped")
                acap_states[id] = 0

        while True:
            seconds_until_next_minute = 60 - datetime.now().second
            print("Sleeping for: " + str(seconds_until_next_minute))
            time.sleep(
                seconds_until_next_minute
            )  # Wait until the next minute starts (at :00 seconds)
            check_schedules()
