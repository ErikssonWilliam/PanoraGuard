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


def test_update_location_success(session, sample_camera):
    assert sample_camera.location == "Test Location"

    response, status_code = CameraService.update_location(
        sample_camera.id, "A-huset, ingång 17"
    )

    response_data = response.get_json()

    assert response is not None
    assert status_code == 200
    assert response_data["message"] == "Location updated successfully"
    assert sample_camera.location == "A-huset, ingång 17"

    session.delete(sample_camera)
    session.commit()


def test_update_location_no_camera(session, sample_camera):
    response, status_code = CameraService.set_confidence("10101", "A-huset, ingång 15")

    response_data = response.get_json()
    assert status_code == 404
    assert response_data is not None
    assert response_data["status"] == "No camera found"

    session.delete(sample_camera)
    session.commit()


def test_cameraID_by_location_success(session):
    camera1 = Camera(
        id="1001",
        ip_address="192.168.1.10",
        location="A-huset",
        confidence_threshold=85.0,
    )
    camera2 = Camera(
        id="1002",
        ip_address="192.168.1.11",
        location="B-huset",
        confidence_threshold=80.0,
    )
    camera3 = Camera(
        id="1003",
        ip_address="192.168.1.12",
        location="B-huset",
        confidence_threshold=90.0,
    )
    session.add_all([camera1, camera2, camera3])
    session.commit()

    response = CameraService.cameraID_by_location("B-huset")

    assert response is not None
    assert len(response) == 2
    assert {"id": "1002"} in response
    assert {"id": "1003"} in response
    assert {"id": "1001"} not in response

    session.delete(camera1)
    session.delete(camera2)
    session.delete(camera3)
    session.commit()
