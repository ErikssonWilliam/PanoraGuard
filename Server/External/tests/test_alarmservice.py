import pytest
from app.models import Alarm, AlarmStatus, User, Camera
from unittest.mock import patch, MagicMock
from app.alarms.alarms_service import AlarmService
from werkzeug.security import generate_password_hash
from uuid import uuid4, UUID


@pytest.fixture
def guard(session):
    """Fixture to create a test guard."""
    session.query(User).delete()
    session.commit()
    guard = User(
        id=uuid4(),
        username="test_guard",
        email="test_guard@example.com",
        role="GUARD",
        password_hash=generate_password_hash("password123"),
    )
    session.add(guard)
    session.commit()
    return guard


@pytest.fixture
def camera(session):
    session.query(Camera).delete()
    session.commit()
    camera = Camera(
        id="camera_123",
        ip_address="192.168.1.1",
        location="Test Location",
        confidence_threshold=80.0,
    )
    session.add(camera)
    session.commit()
    return camera


@pytest.fixture
def alarm(session, camera):
    session.query(Alarm).delete()
    session.commit()
    alarm = Alarm(
        id=uuid4(),
        camera_id=camera.id,
        type="human_detected",
        confidence_score=0.95,
        status=AlarmStatus.PENDING,
        image_base64="R0lGODlhAQABAAAAACwAAAAAAQABAAA=",  # Valid base64 data for testing
    )
    session.add(alarm)
    session.commit()
    return alarm


def test_notify_guard_success(app, guard, alarm, session):
    with app.app_context():
        with patch("smtplib.SMTP") as mock_smtp:
            mock_server = MagicMock()
            mock_smtp.return_value = mock_server

            result = AlarmService.notify_guard(guard.id, alarm.id)
            assert result == "success"

            mock_server.sendmail.assert_called_once()
            args, kwargs = mock_server.sendmail.call_args
            assert "test_guard@example.com" in args[1]

            updated_alarm = session.query(Alarm).get(alarm.id)
            assert updated_alarm.status == AlarmStatus.NOTIFIED


def test_notify_guard_guard_not_found(app, alarm, session):
    with app.app_context():
        nonexistent_guard_id = UUID("00000000-0000-0000-0000-000000000000")
        result = AlarmService.notify_guard(nonexistent_guard_id, alarm.id)
        assert result[1] == 404
        assert result[0].json["status"] == "No guard found"


# def test_notify_guard_alarm_not_found(app, guard, session):
#     with app.app_context():
#         nonexistent_alarm_id = UUID("00000000-0000-0000-0000-000000000000")
#         result = AlarmService.notify_guard(guard.id, nonexistent_alarm_id)
#         assert result[1] == 404
#         assert result[0].json["status"] == "No alarm found"


def test_notify_guard_alarm_no_image(app, guard, alarm, session):
    with app.app_context():
        alarm_without_image = session.query(Alarm).get(alarm.id)
        alarm_without_image.image_base64 = None
        session.commit()

        result = AlarmService.notify_guard(guard.id, alarm_without_image.id)
        assert result[1] == 404
        assert result[0].json["status"] == "No image snapshot associated with alarm"


# def test_notify_guard_email_send_failure(app, guard, alarm, session):
#     with app.app_context():
#         with patch("smtplib.SMTP") as mock_smtp:
#             mock_server = MagicMock()
#             mock_smtp.return_value = mock_server
#             mock_server.sendmail.side_effect = Exception("SMTP error")

#             result = AlarmService.notify_guard(guard.id, alarm.id)
#             assert result[1] == 500
#             assert result[0].json["status"] == "Failed to send email"


def test_notify_guard_image_decode_failure(app, guard, alarm, session):
    with app.app_context():
        alarm_with_invalid_image = session.query(Alarm).get(alarm.id)
        alarm_with_invalid_image.image_base64 = "invalid_base64_data"
        session.commit()

        result = AlarmService.notify_guard(guard.id, alarm_with_invalid_image.id)
        assert result[1] == 500
        assert result[0].json["status"] == "Failed to decode image"
