"""
This file implements the service layer for the alarms module. It provides business logic for
managing alarms, including notifications and email handling.
"""

from app.models import Alarm, AlarmStatus, User, UserRole, Camera
from typing import List
from flask import jsonify
from sqlalchemy import desc, func
from app.extensions import db
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from config import Config
import base64
from email.mime.image import MIMEImage


class AlarmService:
    @staticmethod
    def get_alarms(page: int = 1, per_page: int = 10) -> List[dict]:
        """
        Retrieves alarms with pagination, sorted by timestamp (newest first).

        Args:
            page (int): The current page number (default is 1).
            per_page (int): The number of alarms per page (default is 10).

        Returns:
            List[dict]: A list of alarms with their details.
        """
        # Calculate the offset
        offset = (page - 1) * per_page

        # Query for alarms with limit, offset, and sorting by timestamp
        alarms = (
            db.session.query(Alarm)
            .order_by(desc(Alarm.timestamp))
            .limit(per_page)
            .offset(offset)
            .all()
        )
        return [alarm.to_dict() for alarm in alarms]

    @staticmethod
    def get_total_records() -> int:
        """
        Returns the total number of records in the Alarm table.

        Returns:
            int: The total count of alarms.
        """
        return db.session.query(func.count(Alarm.id)).scalar()

    def get_active_alarms(alarm_type: str) -> List[dict]:
        if alarm_type.lower() == "new":
            alarms = Alarm.query.filter(
                Alarm.status.in_([AlarmStatus.PENDING, AlarmStatus.NOTIFIED])
            ).all()
        elif alarm_type.lower() == "old":
            # Get the 10 most recent alarms with status 'RESOLVED' or 'IGNORED'
            alarms = (
                Alarm.query.filter(
                    Alarm.status.in_([AlarmStatus.RESOLVED, AlarmStatus.IGNORED])
                )
                .order_by(desc(Alarm.timestamp))
                .limit(10)
                .all()
            )
        else:
            # Default case if `alarm_type` doesn't match 'new' or 'old'
            alarms = []

        return [alarm.to_dict() for alarm in alarms]

    @staticmethod
    def get_alarm_by_camera(location: str, camera_id: str) -> List[dict]:
        alarms = (
            db.session.query(Alarm)
            .join(Camera, Camera.id == Alarm.camera_id)
            .filter(Camera.location == location, Alarm.camera_id == camera_id)
            .all()
        )
        return [alarm.to_dict() for alarm in alarms]

    @staticmethod
    def get_alarm_by_operator(operator) -> List[dict]:
        alarms = db.session.query(Alarm).filter(Alarm.operator_id == operator).all()
        return [alarm.to_dict() for alarm in alarms]

    @staticmethod
    def create_alarm(alarm_data):
        """
        Creates a new alarm if the camera exists, no active alarm is present, and the
        confidence score meets the threshold.

        Parameters:
            alarm_data (dict): Dictionary containing camera_id, confidence_score, type, and image_base64.

        Returns:
            dict: A dictionary containing the status of the operation and the created alarm's details.
        """
        # Extract the alarm data
        camera_id = alarm_data.get("camera_id")
        confidence_score = alarm_data.get("confidence_score")
        alarm_type = alarm_data.get("type")
        image_base64 = alarm_data.get("image_base64")

        # Check if camera_id exists in the database
        camera = Camera.query.filter_by(id=camera_id).first()
        if not camera:
            return {"status": "error", "message": "Camera not found"}

        # Check if there is any active alarm with status PENDING or NOTIFIED for the given camera_id
        active_alarm = Alarm.query.filter(
            Alarm.camera_id == camera_id,
            Alarm.status.in_([AlarmStatus.PENDING, AlarmStatus.NOTIFIED]),
        ).first()
        if active_alarm:
            return {
                "status": "error",
                "message": "Already alarm active: " + str(active_alarm.status.value),
            }

        # Check if confidence_score meets the threshold
        if confidence_score < camera.confidence_threshold:
            return {"status": "error", "message": "Confidence score below threshold"}

        # Create a new alarm
        new_alarm = Alarm(
            camera_id=camera_id,
            type=alarm_type,
            confidence_score=confidence_score,
            image_base64=image_base64,
            status=AlarmStatus.PENDING,
        )
        db.session.add(new_alarm)
        db.session.commit()

        # Get the location
        camera = Camera.query.filter_by(id=camera_id).first()
        if not camera:
            return {"status": "error", "message": "Camera not found"}

        return {
            "status": "success",
            "alarm": new_alarm.to_dict(),
            "camera_location": camera.location,
        }

    def get_alarm_image(alarm_ID):
        alarm = Alarm.query.filter_by(id=alarm_ID).first()
        if not alarm:
            return jsonify({"status": "No alarm found"}), 404

        # Retrieve the associated image snapshot
        image_base64 = alarm.image_base64
        if not image_base64:
            return jsonify({"status": "No image snapshot associated with alarm"}), 404
        try:
            return jsonify({"image": image_base64}), 200
        except Exception as e:
            print(f"Failed to return image. Error: {e}")
            return jsonify({"status": "Failed to return image"}), 500

    def update_alarm_status(alarm_id, new_status, guard_id=None, operator_id=None):
        """
        Updates the status of an alarm and optionally associates it with a guard or operator.

        Parameters:
            alarm_id (str): The unique identifier of the alarm.
            new_status (str): The new status to set.
            guard_id (Optional[str]): The ID of the guard to associate with the alarm.
            operator_id (Optional[str]): The ID of the operator updating the alarm.

        Returns:
            dict: The updated alarm details, or None if the operation failed.
        """
        alarm = Alarm.query.get(alarm_id)
        new_status = new_status.upper()
        if alarm:
            if new_status not in [status.value for status in AlarmStatus]:
                return None  # Invalid status

            # Update the alarm status by converting the string to an AlarmStatus enum
            alarm.status = AlarmStatus[new_status.upper()]

            # If the status is changed to IGNORED, delete the image attribute
            if new_status == "IGNORED":
                alarm.image_base64 = None

            # If the status is "notified", update the guard_id
            if new_status == "NOTIFIED" and guard_id:
                guard = User.query.filter_by(id=guard_id, role=UserRole.GUARD).first()
                if guard:
                    alarm.guard_id = guard_id
                else:
                    return None  # Invalid guard_id

            # Update the operator_id if provided
            if operator_id:
                operator = User.query.filter_by(id=operator_id).first()

                if operator:
                    if operator.role.value not in [
                        UserRole.OPERATOR.value,
                        UserRole.ADMIN.value,
                    ]:
                        return None  # The role does not have permission to do this

                    alarm.operator_id = operator_id
                else:
                    return None  # Invalid operator_id

            db.session.commit()
            return alarm.to_dict()
        return None  # Alarm not found

    def notify_guard(guard_ID, alarm_ID):
        """
        Notifies a guard via email about a specific alarm by attaching the alarm's image and details.

        Parameters:
            guard_ID (str): The ID of the guard to notify.
            alarm_ID (str): The ID of the alarm.

        Returns:
            str: "success" if the notification was sent successfully, or an error message.
        """
        # Get the guard's email
        guard = User.query.filter_by(id=guard_ID, role="GUARD").first()
        if not guard:
            return jsonify({"status": "No guard found"}), 404

        # Get the image URL from the alarm
        alarm = Alarm.query.filter_by(id=alarm_ID).first()
        if not alarm:
            return jsonify({"status": "No alarm found"}), 404

        camera = Camera.query.filter_by(id=alarm.camera_id).first()
        if not camera:
            return jsonify({"status": "No camera found"}), 404

        # Retrieve the associated image snapshot URL
        image_base64 = alarm.image_base64
        if not image_base64:
            return jsonify({"status": "No image snapshot associated with alarm"}), 404

        # Send the email
        score = alarm.confidence_score
        subject = "Human Detected Alert"
        body = f"Dear Guard {guard.username}\nThere is an alarm with a score: {score}\n Please check the image attached.\n Location: {camera.location}"
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
            image_data = base64.b64decode(image_base64)
            image_attachment = MIMEImage(image_data, name="alarm_image.jpeg")
            msg.attach(image_attachment)
        except Exception as e:
            print(f"Failed to decode image. Error: {e}")
            return jsonify({"status": "Failed to decode image"}), 500

        try:
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

        # Update the alarm status to notified
        alarm.status = AlarmStatus.NOTIFIED
        db.session.commit()

        return "success"
