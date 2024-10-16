import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Blueprint, request, jsonify

processing = Blueprint("processing", __name__)


def send_email(subject, body, to_email):
    # Function to send an email
    from_email = "tddc88.company3@gmail.com"
    from_password = "xxxf mssn axyz rhqr"

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(from_email, from_password)
        text = msg.as_string()
        server.sendmail(from_email, to_email, text)
        server.quit()
        print("Email sent successfully.")
    except Exception as e:
        print(f"Failed to send email. Error: {e}")


def process_data(data):
    # Function to process incoming data
    if data.get("Type") == "Human":
        score = data.get("Score")

        # Prepare email content
        subject = "Human Detected Alert"
        body = f"Slow down cowboy! \nYou have been caught with a score: {score}\nData: {data}"
        to_email = "sbgubbarna1337@gmail.com"

        # Send email alert
        send_email(subject, body, to_email)


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
