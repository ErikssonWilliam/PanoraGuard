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


def test_set_confidence_success(session, sample_camera):
    assert sample_camera.confidence_threshold == 85.0

    response = CameraService.set_confidence(sample_camera.id, 95.0)
    assert response is not None
    assert sample_camera.confidence_threshold == 95.0

    session.delete(sample_camera)
    session.commit()


def test_set_confidence_no_camera(session, sample_camera):
    response, status_code = CameraService.set_confidence("10101", 95.0)

    assert status_code == 404
    response_data = response.get_json()
    assert response_data is not None

    assert response_data["status"] == "No camera found"

    session.delete(sample_camera)
    session.commit()


def test_update_confidence_success(session):
    camera = Camera(
        id="camera_1",
        ip_address="192.168.1.1",
        location="Test Location",
        confidence_threshold=85.0,
    )
    session.add(camera)
    session.commit()

    new_confidence = 90.0
    response, status_code = CameraService.update_confidence(camera.id, new_confidence)

    assert status_code == 200
    assert response.json["message"] == "Confidence threshold updated successfully"
    assert response.json["confidence_threshold"] == new_confidence

    updated_camera = Camera.query.get(camera.id)
    assert updated_camera.confidence_threshold == new_confidence

    session.delete(camera)
    session.commit()


def test_update_confidence_camera_not_found():
    camera_id = 9999
    confidence = 85.0

    response, status_code = CameraService.update_confidence(camera_id, confidence)

    assert status_code == 404
    assert response.json["error"] == "Camera was not found"


def test_get_confidence_threshold_by_id_success(session):
    camera = Camera(
        id="camera_1",
        ip_address="192.168.1.1",
        location="Test Location",
        confidence_threshold=85.0,
    )
    session.add(camera)
    session.commit()

    result = CameraService.get_confidence_threshold_by_id(camera.id)

    assert result == 85.0

    session.delete(camera)
    session.commit()


def test_get_confidence_threshold_by_id_camera_not_found():
    result = CameraService.get_confidence_threshold_by_id(9999)
    assert result is None
