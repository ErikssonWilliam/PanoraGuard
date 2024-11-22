import pytest
from app.models import Alarm, AlarmStatus, Camera
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


def test_get_alarm_image_success(session, sample_alarm):
    response, status_code = AlarmService.get_alarm_image(sample_alarm.id)

    assert status_code == 200

    response_data = response.get_json()

    assert response_data is not None
    assert "image" in response_data
    assert response_data["image"] == sample_alarm.image_base64

    session.delete(sample_alarm)
    session.commit()


def test_get_alarm_image_alarm_not_found():
    response, status_code = AlarmService.get_alarm_image(uuid.uuid4())
    assert status_code == 404

    response_data = response.get_json()
    assert response_data is not None
    assert response_data["status"] == "No alarm found"


def test_get_alarm_image_no_image(session, sample_camera):
    alarm = Alarm(
        camera_id=sample_camera.id,
        confidence_score=80.0,
        status=AlarmStatus.PENDING,
        type="motion_detection",
        image_base64=None,
    )
    session.add(alarm)
    session.commit()

    response, status_code = AlarmService.get_alarm_image(alarm.id)

    assert status_code == 404

    response_data = response.get_json()
    assert response_data is not None

    assert response_data["status"] == "No image snapshot associated with alarm"

    session.delete(alarm)
    session.commit()


# def test_update_alarm_status_success(session, sample_camera):

#     alarm1 = Alarm(
#         camera_id=sample_camera.id,
#         confidence_score=80.0,
#         status=AlarmStatus.PENDING,
#         type="motion_detection",
#         image_base64=None,
#         operator_id = None,
#         guard_id = None,
#     )
#     session.add(alarm1)
#     session.commit()
#     updated_alarm = AlarmService.update_alarm_status(alarm1.id, "resolved", alarm1.guard_id, alarm1.operator_id)

#     assert updated_alarm is not None
#     assert updated_alarm["status"] == AlarmStatus.RESOLVED.value

#     session.delete(alarm1)
#     session.commit()


def test_update_alarm_status_invalid_status(session, sample_alarm):
    updated_alarm = AlarmService.update_alarm_status(sample_alarm.id, "invalid_status")

    assert updated_alarm is None

    session.delete(sample_alarm)
    session.commit()


def test_update_alarm_status_alarm_not_found(session):
    updated_alarm = AlarmService.update_alarm_status(uuid.uuid4(), "resolved")

    assert updated_alarm is None
