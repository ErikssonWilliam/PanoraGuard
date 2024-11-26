import json
from app.models import Camera
from app.cameras.cameras_service import CameraService


def test_get_cameras(session):
    cameras1 = Camera(
        id="2001",
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
    cameras = CameraService.get_cameras()
    if isinstance(cameras, str):  # If `get_cameras` returns a JSON string
        cameras = json.loads(cameras)
    elif hasattr(
        cameras, "get_data"
    ):  # If `get_cameras` returns a Flask Response object
        cameras = json.loads(cameras.get_data(as_text=True))
    assert isinstance(cameras, list)
    assert len(cameras) == 2
    assert cameras[0]["id"] == "2001"
    assert cameras[0]["ip_address"] == "192.168.1.1"
    assert cameras[0]["location"] == "Test Location"
    assert cameras[0]["confidence_threshold"] == 85.0

    assert cameras[1]["id"] == "1998"
    assert cameras[1]["ip_address"] == "192.168.2.2"
    assert cameras[1]["location"] == "Warehouse"
    assert cameras[1]["confidence_threshold"] == 80.0

    session.query(Camera).delete()
    session.commit()


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
    camera = CameraService.get_camera_by_id(cameras1.id)

    assert camera is not None
    assert camera["id"] == "2002"
    assert camera["ip_address"] == "192.168.1.1"
    assert camera["location"] == "Test Location"
    assert camera["confidence_threshold"] == 85.0
    assert camera["schedule"] == {"start": "08:00", "end": "18:00"}

    session.query(Camera).delete()
    session.commit()
