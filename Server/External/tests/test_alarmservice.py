import pytest

from app.models import Alarm, AlarmStatus, User
from unittest.mock import patch, MagicMock
from app.alarms.alarms_service import AlarmService

from werkzeug.security import generate_password_hash
import uuid

sample_guard_id = uuid.uuid4()
sample_alarm_id = uuid.uuid4()


@pytest.fixture
def guard(session):
    session.query(User).delete()
    session.commit()
    guard = User(
        id=sample_guard_id,
        username="test_guard",
        email="test_guard@example.com",
        role="GUARD",
        password_hash=generate_password_hash("password123"),
    )
    session.add(guard)
    session.commit()
    return guard


@pytest.fixture
def alarm(session):
    session.query(Alarm).delete()
    session.commit()
    alarm = Alarm(
        id=sample_alarm_id,
        camera_id="camera_123",
        type="human_detected",
        confidence_score=0.95,
        status=AlarmStatus.PENDING,
        image_base64="R0lGODlhAQABAAAAACwAAAAAAQABAAA=",
    )
    session.add(alarm)
    session.commit()
    return alarm


def test_notify_guard(app, guard, alarm, session):
    with app.app_context():
        guard = session.query(User).get(guard.id)
        alarm = session.query(Alarm).get(alarm.id)

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

            session.delete(updated_alarm)
            session.delete(guard)
            session.commit()
