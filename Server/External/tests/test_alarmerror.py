from app.models import Camera
from app.models import Alarm, AlarmStatus
from app.alarms.alarms_service import AlarmService


def test_create_alarm_camera_not_found(session):
    # Testdata för ett alarm där camera_id inte existerar
    alarm_data = {
        "camera_id": "9999",  # Ett ID som inte finns i databasen
        "confidence_score": 85,
        "type": "motion_detection",
        "image_base64": "some_base64_encoded_image_data",
    }

    # Anropa create_alarm-funktionen
    result = AlarmService.create_alarm(alarm_data)

    # Kontrollera att rätt felmeddelande returneras
    assert result is not None
    assert result["status"] == "error"
    assert result["message"] == "Camera not found"


def test_create_alarm_already_active(session):
    # Steg 1: Skapa en kamera
    camera = Camera(
        id=1,
        ip_address="192.168.1.1",
        location="Test Location",
        confidence_threshold=85,
    )
    session.add(camera)
    session.commit()

    # Steg 2: Skapa ett aktivt alarm (status=PENDING) för kameran
    active_alarm = Alarm(
        camera_id=camera.id,
        confidence_score=90,
        type="motion_detection",
        status=AlarmStatus.PENDING,
    )
    session.add(active_alarm)
    session.commit()

    # Steg 3: Försök skapa ett nytt alarm för samma kamera
    alarm_data = {
        "camera_id": camera.id,
        "confidence_score": 85,
        "type": "motion_detection",
        "image_base64": "some_base64_encoded_image_data",
    }
    result = AlarmService.create_alarm(alarm_data)

    # Steg 4: Kontrollera att rätt felmeddelande returneras
    assert result is not None
    assert result["status"] == "error"
    assert result["message"] == "Already alarm active: PENDING"

    # Rensa upp sessionen
    session.delete(active_alarm)
    session.delete(camera)
    session.commit()


def test_create_alarm_below_confidence_threshold(session):
    # Steg 1: Skapa en kamera med en confidence_threshold
    camera = Camera(
        id=1,
        ip_address="192.168.1.1",
        location="Test Location",
        confidence_threshold=80,
    )
    session.add(camera)
    session.commit()

    # Steg 2: Försök skapa ett alarm med en confidence_score under tröskeln
    alarm_data = {
        "camera_id": camera.id,
        "confidence_score": 75,  # Under tröskeln på 80
        "type": "motion_detection",
        "image_base64": "some_base64_encoded_image_data",
    }
    result = AlarmService.create_alarm(alarm_data)

    # Steg 3: Kontrollera att rätt felmeddelande returneras
    assert result is not None
    assert result["status"] == "error"
    assert result["message"] == "Confidence score below threshold"

    # Rensa upp sessionen
    session.delete(camera)
    session.commit()
