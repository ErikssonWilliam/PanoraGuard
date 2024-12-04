import pytest
from app.models import Camera
from app.models import Alarm, AlarmStatus
from app.alarms.alarms_service import AlarmService


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
        status=AlarmStatus.PENDING,
        type="sound_detection",
    )
    session.add_all([alarm1, alarm2])
    session.commit()
    return [alarm1, alarm2]


def test_get_alarms(session, sample_alarms):
    # Sort sample alarms by timestamp in descending order
    expected_alarms = sorted(
        [alarm.to_dict() for alarm in sample_alarms],
        key=lambda x: x["timestamp"],
        reverse=True,
    )

    # Call the service method
    result = AlarmService.get_alarms()

    # Ensure the number of alarms matches
    assert len(result) == len(sample_alarms)

    # Compare each alarm in the sorted expected list to the result
    for expected, retrieved in zip(expected_alarms, result):
        assert expected["camera_id"] == retrieved["camera_id"]
        assert expected["confidence_score"] == retrieved["confidence_score"]
        assert expected["status"] == retrieved["status"]
        assert expected["type"] == retrieved["type"]

    # Cleanup the sample alarms from the database
    for alarm in sample_alarms:
        session.delete(alarm)
    session.commit()


def test_create_alarm(session, sample_camera):
    alarm_data = {
        "camera_id": sample_camera.id,
        "confidence_score": 95.5,
        "type": "motion_detection",
        "image_base64": None,
    }

    result = AlarmService.create_alarm(alarm_data)

    assert result["status"] == "success"
    assert "alarm" in result

    retrieved_alarm = Alarm.query.filter_by(camera_id=sample_camera.id).first()

    assert retrieved_alarm is not None
    assert retrieved_alarm.camera_id == sample_camera.id
    assert retrieved_alarm.status == AlarmStatus.PENDING
    assert retrieved_alarm.type == "motion_detection"

    session.delete(retrieved_alarm)
    session.delete(sample_camera)
    session.commit()
