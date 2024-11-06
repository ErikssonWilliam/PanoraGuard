# This file contains the service layer for the alarms module

from app.models import Alarm, AlarmStatus, User 
from typing import List
from flask import jsonify
from app.extensions import db  # Import the database instance

# To send email
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from config import Config


class AlarmService:
    def get_alarms() -> List[Alarm]:
        alarms = Alarm.query.all()
        return [alarm.to_dict() for alarm in alarms]

    def create_alarm(alarm_data):
        new_alarm = Alarm(
            camera_id=alarm_data["camera_id"],
            confidence_score=alarm_data["confidence_score"],
            timestamp=alarm_data["timestamp"],
            image_snapshot_id=alarm_data["image_snapshot_id"],
            video_clip_id=alarm_data["video_clip_id"],
            # ToDO: snapshot_string?
            # ToDo: type?
            status="pending",  # Set default status to "pending"
            operator_id=alarm_data["operator_id"],
        )
        db.session.add(new_alarm)
        db.session.commit()
        return new_alarm

    def get_alarm_by_id(schedule_id):
        return  # add logic

    def update_alarm_status(alarm_id, new_status):
        # Find the alarm by ID
        alarm = Alarm.query.get(alarm_id)
        if alarm:
            # Check if the status is valid
            if new_status not in [status.value for status in AlarmStatus]:
                return None  # Invalid status

            # Update the alarm status
            # Convert string to enum
            alarm.status = AlarmStatus[new_status.upper()]
            db.session.commit()
            return alarm.to_dict()  # Return the updated alarm as a dictionary
        return None  # Alarm not found

    def delete_alarm_by_id(schedule_id):
        #    alarm = AlarmController.get_alarm_by_id(alarm_id)
        #    if alarm:
        #        return jsonify(alarm)
        #    else:
        #        return jsonify({"message": "Alarm not found"})
        #        return jsonify({"alarm_id": str(alarm_id)})
        return  # add logic

    def notify_guard(guard_ID, alarm_ID):
        # Step 1: Get the guard's email
        guard = User.query.filter_by(id=guard_ID, role="GUARD").first()
        if not guard:
            return jsonify({"status": "No guard found"}), 404

        # Step 2: Get the image URL from the alarm
        alarm = Alarm.query.filter_by(id=alarm_ID).first()
        if not alarm:
            return jsonify({"status": "No alarm found"}), 404

        # Retrieve the associated image snapshot URL
        image_snapshot = ImageSnapshot.query.filter_by(
            id=alarm.image_snapshot_id
        ).first()
        if not image_snapshot:
            return jsonify({"status": "No image snapshot associated with alarm"}), 404

        # Step 3: Send the email
        score = alarm.confidence_score
        subject = "Human Detected Alert"
        body = f"Slow down cowboy! \nYou have been caught with a score: {score}\n"
        to_email = guard.email
        # Gmail account credentials
        from_email = "tddc88.company3@gmail.com"
        from_password = Config.email_pswrd

        # Create the email
        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        try:
            print("Email content before sending:")
            print(msg)
            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(from_email, from_password)
            content = msg.as_string()
            print(content)
            server.sendmail(from_email, to_email, content)
            server.quit()

            print("Email sent successfully.")
        except Exception as e:
            print(f"Failed to send email. Error: {e}")

        # Step 4: Update the alarm status to confirmed
        alarm.status = AlarmStatus.CONFIRMED
        db.session.commit()

        # Step 5: Placeholder for sending the notification
        # print(f"Sending notification to {guard.email} with alarm image URL: {image_snapshot.url}")
        return "success"
