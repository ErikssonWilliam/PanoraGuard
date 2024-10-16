from email import encoders
from email.mime.base import MIMEBase
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Blueprint, request, jsonify
from app.snapshots.snapshots_controller import SnapshotController
from config import Config


processing = Blueprint("processing", __name__)


def send_email(subject, body, to_email, snapshot_path=None):
    # Gmail account credentials
    from_email = "tddc88.company3@gmail.com"
    # This does currently not work (change to real password locally)
    from_password = Config.email_pswrd

    # Create the email
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    # Attach the snapshot file if provided
    if snapshot_path and os.path.exists(snapshot_path):
        try:
            # Open the file in binary mode
            with open(snapshot_path, "rb") as attachment:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(attachment.read())

            # Encode the file to base64
            encoders.encode_base64(part)

            # Add header to indicate the attachment filename
            part.add_header(
                "Content-Disposition",
                f"attachment; filename={os.path.basename(snapshot_path)}"
            )

            # Attach the file to the email
            msg.attach(part)
            print(f"Snapshot '{snapshot_path}' attached successfully.")
        except Exception as e:
            print(f"Failed to attach snapshot. Error: {e}")
    else:
        print("No snapshot provided or file does not exist.")

    try:
        print("Email content before sending:")
        print(msg)  # This will print out the entire MIME structure
        # Connect to Gmail's SMTP server using TLS (port 587)
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Start TLS encryption
        server.login(from_email, from_password)
        content = msg.as_string()
        # Send the email
        print(content)
        server.sendmail(from_email, to_email, content)
        server.quit()  # Close the connection

        print("Email sent successfully.")
    except Exception as e:
        print(f"Failed to send email. Error: {e}")


def process_data(data):
    # Function to process incoming data
    if data.get("type") == "Human":
        score = data.get("score")
        response, status_code = SnapshotController.upload_snapshot()
        file_path = None
        if status_code == 201:
            # Extract the directory path from the response
            file_path = response.json.get("dir")

        # Prepare email content
        subject = "Human Detected Alert"
        body = f"Slow down cowboy! \nYou have been caught with a score: {score}\n"
        to_email = "sbgubbarna1337@gmail.com"

        # Send email with the snapshot attached
        send_email(subject, body, to_email, file_path)


@processing.route('/camera/data_JSON', methods=['POST'])
def receive_data():
    if request.is_json:
        data = request.get_json()
        print(f"Received data: {data}")  # Log the data for debugging

        # Process the data
        process_data(data)

        return jsonify({"message": "Data received and processed."}), 200
    else:
        return jsonify({"message": "Invalid data format. Expected JSON."}), 400
