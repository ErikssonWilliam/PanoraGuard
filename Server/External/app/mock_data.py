from .extensions import db
from .models import (
    User,
    UserRole,
    Camera,
    Alarm,
    CameraControlAction,
    CameraControlType,
    AlarmStatus,
)
import uuid

session = db.session


def create_mock_users():
    user1 = User(
        username="john_doex",
        password_hash="hashed_password123x",
        role=UserRole.OPERATOR,
        email="john@examplex.com",
    )

    user2 = User(
        username="jane_doeex",
        password_hash="hashed_password456x",
        role=UserRole.MANAGER,
        email="jane@examplex.com",
    )
    user3 = User(
        id=uuid.UUID("35ad0eab-2347-404e-a833-d8b2fb0367ff"),
        username="guardian_of_the_galaxy",
        password_hash="hashed_password456xx",
        role=UserRole.GUARD,
        email="sbgubbarna1337@gmail.com",
    )

    session.add(user1)
    session.add(user2)
    session.add(user3)
    session.commit()
    return user1, user2, user3


def create_mock_camera():
    camera = Camera(ip_address="HTTPS//127.123.etc", location="A-huset")
    session.add(camera)
    session.commit()
    return camera


def create_mock_alarm(user, camera, statusState):
    alarm = Alarm(
        camera_id=camera.id,
        type="Human",
        confidence_score=0.95,
        image_base64="AAAABBBBBCCCCDDDDD",
        status=statusState,
        operator_id=user.id,
    )

    session.add(alarm)
    session.commit()
    return alarm


def create_mock_alarm_test(idtest, user, camera, statusState):
    alarm = Alarm(
        id=idtest,
        camera_id=camera.id,
        type="Human",
        confidence_score=0.95,
        image_base64="AAAABBBBBCCCCDDDDD",
        status=statusState,
        operator_id=user.id,
    )

    session.add(alarm)
    session.commit()
    return alarm


def create_mock_camera_control_action(camera, user):
    cca = CameraControlAction(
        camera_id=camera.id,
        initiated_by=user.id,
        control_type=CameraControlType.BRIGHTNESS,
        value="0.83",
    )
    session.add(cca)
    session.commit()
    return cca


def create_mock_data():
    user1, user2, user3 = create_mock_users()
    camera = create_mock_camera()
    create_mock_alarm(user1, camera, AlarmStatus.PENDING)
    create_mock_alarm_test(
        uuid.UUID("cc006a17-0852-4e0e-b13c-36e4092f767d"),
        user1,
        camera,
        AlarmStatus.IGNORED,
    )
    create_mock_alarm(user1, camera, AlarmStatus.IGNORED)
    create_mock_alarm(user1, camera, AlarmStatus.NOTIFIED)
    create_mock_alarm(user1, camera, AlarmStatus.PENDING)
    create_mock_alarm(user1, camera, AlarmStatus.RESOLVED)
    create_mock_camera_control_action(camera, user1)
    return "Success"


def get_mock_user(user_id):
    return session.query(User).filter_by(id=user_id).first()
