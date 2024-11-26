from app.models import Camera
from app.models import Alarm, AlarmStatus
from app.alarms.alarms_service import AlarmService


def test_create_alarm_camera_not_found(session):
    alarm_data = {
        "camera_id": "9999",
        "confidence_score": 85,
        "type": "motion_detection",
        "image_base64": "some_base64_encoded_image_data",
    }

    result = AlarmService.create_alarm(alarm_data)

    assert result is not None
    assert result["status"] == "error"
    assert result["message"] == "Camera not found"


def test_create_alarm_already_active(session):
    camera = Camera(
        id=1,
        ip_address="192.168.1.1",
        location="Test Location",
        confidence_threshold=85,
    )
    session.add(camera)
    session.commit()

    active_alarm = Alarm(
        camera_id=camera.id,
        confidence_score=90,
        type="motion_detection",
        status=AlarmStatus.PENDING,
    )
    session.add(active_alarm)
    session.commit()

    alarm_data = {
        "camera_id": camera.id,
        "confidence_score": 85,
        "type": "motion_detection",
        "image_base64": "some_base64_encoded_image_data",
    }
    result = AlarmService.create_alarm(alarm_data)

    assert result is not None
    assert result["status"] == "error"
    assert result["message"] == "Already alarm active: PENDING"

    session.delete(active_alarm)
    session.delete(camera)
    session.commit()


def test_create_alarm_below_confidence_threshold(session):
    camera = Camera(
        id=1,
        ip_address="192.168.1.1",
        location="Test Location",
        confidence_threshold=80,
    )
    session.add(camera)
    session.commit()

    alarm_data = {
        "camera_id": camera.id,
        "confidence_score": 75,
        "type": "motion_detection",
        "image_base64": "some_base64_encoded_image_data",
    }
    result = AlarmService.create_alarm(alarm_data)

    assert result is not None
    assert result["status"] == "error"
    assert result["message"] == "Confidence score below threshold"

    session.delete(camera)
    session.commit()
