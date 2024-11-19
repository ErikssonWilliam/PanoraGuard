# from unittest.mock import patch, mock_open
# from app.dataprocessing.dataprocessing_service import (
#     DataprocessingService,
# )  # Adjust path as needed
# from config import Config  # Import Config directly

# # Since Config.email_pswrd is set to "test_password" when pytest is detected,
# # we don't need to mock Config.email_pswrd separately.


# @patch("smtplib.SMTP")
# @patch("os.path.exists", return_value=True)
# @patch("builtins.open", new_callable=mock_open, read_data=b"test snapshot data")
# def test_send_email_with_attachment(mock_open, mock_exists, mock_smtp):
#     # Instantiate the service
#     service = DataprocessingService()

#     # Call send_email with a mock snapshot path
#     subject = "Test Subject"
#     body = "Test Body"
#     to_email = "test@example.com"
#     snapshot_path = "/path/to/snapshot.jpg"

#     # Run the method
#     service.send_email(subject, body, to_email, snapshot_path)

#     # Assertions to check if the email was prepared and sent
#     mock_smtp.assert_called_once_with("smtp.gmail.com", 587)  # Check SMTP setup
#     mock_smtp_instance = mock_smtp.return_value  # Get the SMTP instance mock
#     mock_smtp_instance.starttls.assert_called_once()  # Check TLS start
#     mock_smtp_instance.login.assert_called_once_with(
#         "tddc88.company3@gmail.com", Config.email_pswrd
#     )  # Config.email_pswrd should be "test_password" during tests

#     # Check if the email was sent
#     mock_smtp_instance.sendmail.assert_called_once()

#     # Optionally, verify the content structure
#     msg_content = mock_smtp_instance.sendmail.call_args[0][2]
#     assert "Test Subject" in msg_content
#     assert "Test Body" in msg_content


# @patch("smtplib.SMTP")
# def test_send_email_without_attachment(mock_smtp):
#     # Instantiate the service
#     service = DataprocessingService()

#     # Call send_email without a snapshot path
#     subject = "Test Subject"
#     body = "Test Body"
#     to_email = "test@example.com"
#     snapshot_path = None

#     # Run the method
#     service.send_email(subject, body, to_email, snapshot_path)

#     # Assertions to check if the email was prepared and sent
#     mock_smtp.assert_called_once_with("smtp.gmail.com", 587)
#     mock_smtp_instance = mock_smtp.return_value
#     mock_smtp_instance.starttls.assert_called_once()
#     mock_smtp_instance.login.assert_called_once_with(
#         "tddc88.company3@gmail.com", Config.email_pswrd
#     )

#     # Check if the email was sent
#     mock_smtp_instance.sendmail.assert_called_once()
