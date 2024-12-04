import pytest
from app.models import Alarm, AlarmStatus, Camera, User, UserRole
from app.alarms.alarms_service import AlarmService
import uuid


@pytest.fixture
def sample_camera(session):
    session.query(Camera).delete()
    session.commit()
    camera = Camera(
        id="camera_1",
        ip_address="192.168.1.1",
        location="Test Location",
        confidence_threshold=0.85,
    )
    session.add(camera)
    session.commit()
    return camera


@pytest.fixture
def sample_alarm(session, sample_camera):
    session.query(Alarm).delete()
    session.commit()
    alarm = Alarm(
        camera_id=sample_camera.id,
        confidence_score=95.5,
        status=AlarmStatus.PENDING,
        type="motion_detection",
        image_base64="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
    )
    session.add(alarm)
    session.commit()
    return alarm


@pytest.fixture
def sample_guard(session):
    session.query(User).delete()
    session.commit()
    guard = User(
        id=uuid.uuid4(),
        username="guard_user",
        password_hash="hashed_password",
        role=UserRole.GUARD,
        email="guard@example.com",
    )
    session.add(guard)
    session.commit()
    return guard


@pytest.fixture
def sample_operator(session):
    operator = User(
        id=uuid.uuid4(),
        username="operator_user",
        password_hash="hashed_password",
        role=UserRole.OPERATOR,
        email="operator@example.com",
    )
    session.add(operator)
    session.commit()
    return operator


def test_update_alarm_status_success(
    session, sample_alarm, sample_guard, sample_operator
):
    updated_alarm = AlarmService.update_alarm_status(
        alarm_id=sample_alarm.id,
        new_status="resolved",
        guard_id=sample_guard.id,
        operator_id=sample_operator.id,
    )

    assert updated_alarm is not None
    assert updated_alarm["status"] == AlarmStatus.RESOLVED.value
    assert updated_alarm["operator_id"] == str(sample_operator.id)


def test_update_alarm_status_notified_success(session, sample_alarm, sample_guard):
    updated_alarm = AlarmService.update_alarm_status(
        alarm_id=sample_alarm.id, new_status="notified", guard_id=sample_guard.id
    )

    assert updated_alarm is not None
    assert updated_alarm["status"] == AlarmStatus.NOTIFIED.value
    assert updated_alarm["guard_id"] == str(sample_guard.id)


def test_update_alarm_status_invalid_status(session, sample_alarm):
    updated_alarm = AlarmService.update_alarm_status(
        alarm_id=sample_alarm.id, new_status="invalid_status"
    )

    assert updated_alarm is None


def test_update_alarm_status_ignored(session, sample_alarm):
    updated_alarm = AlarmService.update_alarm_status(
        alarm_id=sample_alarm.id, new_status="ignored"
    )

    assert updated_alarm is not None
    assert updated_alarm["status"] == AlarmStatus.IGNORED.value
    assert updated_alarm["image_base64"] is None


def test_update_alarm_status_guard_not_found(session, sample_alarm):
    invalid_guard_id = uuid.uuid4()
    updated_alarm = AlarmService.update_alarm_status(
        alarm_id=sample_alarm.id, new_status="notified", guard_id=invalid_guard_id
    )

    assert updated_alarm is None


def test_update_alarm_status_operator_not_found(session, sample_alarm):
    invalid_operator_id = uuid.uuid4()
    updated_alarm = AlarmService.update_alarm_status(
        alarm_id=sample_alarm.id, new_status="resolved", operator_id=invalid_operator_id
    )

    assert updated_alarm is None
