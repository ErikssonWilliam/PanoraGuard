import pytest
from app.models import Camera
from app.cameras.cameras_service import CameraService


@pytest.fixture
def sample_camera(session):
    session.query(Camera).delete()
    session.commit()
    camera = Camera(
        id="camera_1",
        ip_address="192.168.1.1",
        location="Test Location",
        confidence_threshold=85.0,
    )
    session.add(camera)
    session.commit()
    return camera


def test_get_alarm_image_success(session, sample_camera):
    assert sample_camera.confidence_threshold == 85.0

    response = CameraService.set_confidence(sample_camera.id, 95.0)
    assert response is not None
    assert sample_camera.confidence_threshold == 95.0

    session.delete(sample_camera)
    session.commit()


def test_get_alarm_image_no_camera(session, sample_camera):
    response, status_code = CameraService.set_confidence("10101", 95.0)

    assert status_code == 404
    response_data = response.get_json()
    assert response_data is not None

    assert response_data["status"] == "No camera found"

    session.delete(sample_camera)
    session.commit()
