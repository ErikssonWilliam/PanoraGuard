# This file contains the controller for the alarms module
from flask import request, jsonify
from app.models import Alarm  # important for frontend
from .alarms_service import AlarmService
from app.socketio_instance import socketio


class AlarmController:
    def get_alarms():
        return jsonify(AlarmService.get_alarms()), 200

    @staticmethod
    def add_alarm():
        alarm_data = request.get_json()
        print(alarm_data) # Debugging
        new_alarm = AlarmService.create_alarm(alarm_data)
        if new_alarm["status"] == "success":
            # Notify frontend about the new alarm
            socketio.emit("new_alarm", new_alarm["alarm"])
            return jsonify(new_alarm), 201
        else:
            return jsonify({"message": new_alarm["message"]}), 400

    def get_alarm_image(alarm_ID):
        return AlarmService.get_alarm_image(alarm_ID)

    # Properly serializes the Alarm object using to_dict() to ensure correct JSON formatting for frontend compatibility
    @staticmethod
    def get_alarm_by_id(alarm_id):
        # Fetch the alarm from the database by ID
        alarm = Alarm.query.get(alarm_id)
        if alarm:
            # Convert to dictionary and return as JSON
            return jsonify(alarm.to_dict())
        else:
            return jsonify({"error": "Alarm not found"}), 404

    def delete_alarm_by_id(alarm_id):
        return AlarmService.delete_alarm_by_id(alarm_id)

    def notify_guard(guard_ID, alarm_ID):
        return AlarmService.notify_guard(guard_ID, alarm_ID)

    # @staticmethod
    # def notify_new_alarm(alarm):
    #     socketio.emit("new_alarm", alarm)

    def update_alarm_status(alarm_id):
        alarm_data = request.get_json()
        if not alarm_data or "status" not in alarm_data:
            return jsonify({"message": "Status is required"}), 400

        updated_alarm = AlarmService.update_alarm_status(alarm_id, alarm_data["status"])
        if updated_alarm:
            return jsonify(updated_alarm), 200
        else:
            return jsonify({"message": "Alarm not found"}), 404


# Frontend Logic:
# import io from 'socket.io-client';

# // Connect to the backend WebSocket server
# const socket = io('http://your-backend-server-url');

# // Listen for the 'new_alarm' event
# socket.on('new_alarm', (alarm) => {
#     console.log('New alarm received:', alarm);
#     // Update the UI or notify the user about the new alarm
#     displayNewAlarm(alarm);
# });

# function displayNewAlarm(alarm) {
#     // Implement your logic to update the UI with the new alarm
#     // For example, you can add the new alarm to a list of alarms
#     const alarmList = document.getElementById('alarm-list');
#     const alarmItem = document.createElement('li');
#     alarmItem.textContent = `Alarm ID: ${alarm.id}, Confidence Score: ${alarm.confidence_score}`;
#     alarmList.appendChild(alarmItem);
# }
