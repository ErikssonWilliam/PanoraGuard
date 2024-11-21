import pytest
from app.models import Camera, Alarm, AlarmStatus, User, UserRole
from app.alarms.alarms_service import AlarmService
import uuid


@pytest.fixture
def sample_camera(session):
    session.query(Camera).delete()
    session.commit()
    camera = Camera(
        id="camera_1",
        ip_address="192.168.1.1",
        location="A-huset",
        confidence_threshold=95.0,
    )
    session.add(camera)
    session.commit()
    return camera


@pytest.fixture
def sample_alarms(session, sample_camera):
    session.query(Alarm).delete()
    session.commit()
    alarm1 = Alarm(
        camera_id=sample_camera.id,
        confidence_score=95.5,
        status=AlarmStatus.PENDING,
        type="motion_detection",
    )
    alarm2 = Alarm(
        camera_id=sample_camera.id,
        confidence_score=90.0,
        status=AlarmStatus.NOTIFIED,
        type="sound_detection",
    )
    alarm3 = Alarm(
        camera_id=sample_camera.id,
        confidence_score=88.0,
        status=AlarmStatus.RESOLVED,
        type="motion_detection",
    )
    alarm4 = Alarm(
        camera_id=sample_camera.id,
        confidence_score=85.0,
        status=AlarmStatus.IGNORED,
        type="sound_detection",
    )
    session.add_all([alarm1, alarm2, alarm3, alarm4])
    session.commit()
    return [alarm1, alarm2, alarm3, alarm4]


@pytest.fixture
def sample_operator(session):
    session.query(User).delete()
    session.commit()
    operator = User(
        id=uuid.uuid4(),
        username="test_operator",
        password_hash="hashed_password",
        role=UserRole.OPERATOR,
        email="operator@example.com",
    )
    session.add(operator)
    session.commit()
    return operator


def test_get_active_alarms_new(session, sample_alarms):
    result = AlarmService.get_active_alarms("new")

    assert len(result) == 2
    expected_alarms = [
        alarm.to_dict()
        for alarm in sample_alarms
        if alarm.status in [AlarmStatus.PENDING, AlarmStatus.NOTIFIED]
    ]
    for expected, retrieved in zip(expected_alarms, result):
        assert expected["camera_id"] == retrieved["camera_id"]
        assert expected["confidence_score"] == retrieved["confidence_score"]
        assert expected["status"] == retrieved["status"]
        assert expected["type"] == retrieved["type"]


def test_get_active_alarms_old(sample_alarms):
    result = AlarmService.get_active_alarms("old")

    assert len(result) <= 10
    expected_alarms = [
        alarm.to_dict()
        for alarm in sorted(
            [
                alarm
                for alarm in sample_alarms
                if alarm.status in [AlarmStatus.RESOLVED, AlarmStatus.IGNORED]
            ],
            key=lambda a: a.timestamp,
            reverse=True,
        )[:10]
    ]
    for expected, retrieved in zip(expected_alarms, result):
        assert expected["camera_id"] == retrieved["camera_id"]
        assert expected["confidence_score"] == retrieved["confidence_score"]
        assert expected["status"] == retrieved["status"]
        assert expected["type"] == retrieved["type"]


def test_get_active_alarms_invalid_type(session, sample_alarms):
    result = AlarmService.get_active_alarms("invalid")

    assert result == []

    for alarm in sample_alarms:
        session.delete(alarm)
    session.commit()


def test_get_alarm_by_camera(session, sample_alarms, sample_camera):
    result = AlarmService.get_alarm_by_camera("A-huset", sample_camera.id)

    assert len(result) == len(sample_alarms)
    expected_alarms = [
        alarm.to_dict()
        for alarm in sample_alarms
        if alarm.camera_id == sample_camera.id and sample_camera.location == "A-huset"
    ]
    for expected, retrieved in zip(expected_alarms, result):
        assert expected["camera_id"] == retrieved["camera_id"]
        assert expected["confidence_score"] == retrieved["confidence_score"]
        assert expected["status"] == retrieved["status"]
        assert expected["type"] == retrieved["type"]


def test_get_alarm_by_camera_no_match(session, sample_alarms, sample_camera):
    result = AlarmService.get_alarm_by_camera("B-huset", sample_camera.id)

    assert result == []


def test_get_alarm_by_operator(session, sample_alarms, sample_operator):
    sample_alarms[0].operator_id = sample_operator.id
    sample_alarms[1].operator_id = sample_operator.id
    session.commit()

    result = AlarmService.get_alarm_by_operator(sample_operator.id)

    assert len(result) == 2
    expected_alarms = [
        alarm.to_dict()
        for alarm in sample_alarms
        if alarm.operator_id == sample_operator.id
    ]
    for expected, retrieved in zip(expected_alarms, result):
        assert expected["camera_id"] == retrieved["camera_id"]
        assert expected["confidence_score"] == retrieved["confidence_score"]
        assert expected["status"] == retrieved["status"]
        assert expected["type"] == retrieved["type"]


def test_get_alarm_by_operator_no_match(session, sample_alarms, sample_camera):
    result = AlarmService.get_alarm_by_operator(uuid.uuid4())

    assert result == []
