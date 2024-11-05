# This file contains the controller for the alarms module

from app.models import *
from flask import request, jsonify
from flask_socketio import SocketIO, emit # Importing the socketio library for real-time communication
from .alarms_service import AlarmService

# Initialising the socketio object
socketio = SocketIO()

class AlarmController:
    def get_alarms():
        return jsonify(AlarmService.get_alarms()), 200

    @staticmethod
    def add_alarm():
        alarm_data = request.get_json()
        new_alarm = AlarmService.create_alarm(alarm_data)
        # Notify frontend about the new alarm
        AlarmController.notify_new_alarm(new_alarm)
        return jsonify(new_alarm), 201

    def get_alarm_by_id(alarm_id):
        #        alarm = Alarm.query.get(alarm_id)
        #       if alarm:
        #            return {
        #                "id": alarm.id,
        #                "camera_id": alarm.camera_id,
        #                "confidence_score": alarm.confidence_score,
        #                "timestamp": alarm.timestamp,
        #                "image_snapshot_id": alarm.image_snapshot_id,
        #                "video_clip_id": alarm.video_clip_id,
        #                "status": alarm.status,
        #                "operator_id": alarm.operator_id
        #        }
        #        else:
        #            return None
        return jsonify({"alarm_id": str(alarm_id)})

    def delete_alarm_by_id(alarm_id):
        return AlarmService.delete_alarm_by_id(alarm_id)

    @staticmethod
    def notify_new_alarm(alarm):
        socketio.emit("new_alarm", alarm)


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