import pytest
from app.models import Camera
from app.cameras.cameras_service import CameraService


@pytest.fixture
def test_camera(session):
    session.query(Camera).delete()
    session.commit()
    cameras1 = Camera(
        id="2002",
        ip_address="192.168.1.1",
        location="Test Location",
        confidence_threshold=85,
    )
    cameras2 = Camera(
        id="1998",
        ip_address="192.168.2.2",
        location="Warehouse",
        confidence_threshold=80,
    )
    session.add(cameras1)
    session.add(cameras2)
    session.commit()


@pytest.fixture
def test_get_cameras(session, test_camera):
    # Retrieve cameras using the service method
    cameras = CameraService.get_cameras()

    # Assert that we get the correct data in the expected format
    assert isinstance(cameras, list)
    assert len(cameras) == 2
    assert cameras[0]["id"] == "2002"
    assert cameras[0]["ip_address"] == "192.168.1.1"
    assert cameras[0]["location"] == "Test Location"
    assert cameras[0]["confidence_threshold"] == 0.85

    assert cameras[1]["id"] == "1998"
    assert cameras[1]["ip_address"] == "192.168.2.2"
    assert cameras[1]["location"] == "Warehouse"
    assert cameras[1]["confidence_threshold"] == 0.80


def test_camera_by_id(session):
    cameras1 = Camera(
        id="2002",
        ip_address="192.168.1.1",
        location="Test Location",
        confidence_threshold=85.0,
        schedule='{"start": "08:00", "end": "18:00"}',
    )
    session.add(cameras1)
    session.commit()
    # Retrieve the camera by its ID
    camera = CameraService.get_camera_by_id(cameras1.id)

    # Assert that we get the correct data in the expected format
    # assert camera is not None
    assert camera["id"] == "2002"
    assert camera["ip_address"] == "192.168.1.1"
    assert camera["location"] == "Test Location"
    assert camera["confidence_threshold"] == 85.0
    assert camera["schedule"] == {"start": "08:00", "end": "18:00"}

    session.query(Camera).delete()
    session.commit()
