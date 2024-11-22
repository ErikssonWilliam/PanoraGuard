from app.models import Camera
from app.cameras.cameras_service import CameraService


def test_update_ip_camera_not_found(session):
    camera_id = 9999
    ip_address = "192.168.0.10"

    response, status_code = CameraService.update_ip(camera_id, ip_address)

    assert status_code == 404
    assert response.json["error"] == "Camera not found"


def test_update_ip_success(session):
    camera = Camera(
        id="camera_1",
        ip_address="192.168.1.1",
        location="Test Location",
        confidence_threshold=85.0,
    )
    session.add(camera)
    session.commit()

    new_ip_address = "192.168.0.10"
    response, status_code = CameraService.update_ip(camera.id, new_ip_address)

    assert status_code == 200
    assert response.json["message"] == "IP address updated successfully"
    assert response.json["ip_address"] == new_ip_address

    updated_camera = Camera.query.get(camera.id)
    assert updated_camera.ip_address == new_ip_address

    session.delete(camera)
    session.commit()


def test_update_schedule_camera_not_found(session):
    camera_id = 9999
    schedule = "08:00-18:00"

    response, status_code = CameraService.update_schedule(camera_id, schedule)

    assert status_code == 404
    assert response.json["error"] == "Camera not found"


def test_update_schedule_success(session):
    camera = Camera(
        id="camera_1",
        ip_address="192.168.1.1",
        location="Test Location",
        confidence_threshold=85.0,
        schedule='{"start": "08:00", "end": "18:00"}',
    )
    session.add(camera)
    session.commit()

    schedule = '{"start": "08:00", "end": "19:00"}'
    response, status_code = CameraService.update_schedule(camera.id, schedule)

    assert status_code == 200
    assert response.json["message"] == "Schedule updated successfully"
    assert response.json["schedule"] == schedule

    updated_camera = session.query(Camera).get(camera.id)
    assert updated_camera.schedule == schedule

    session.delete(updated_camera)
    session.commit()
