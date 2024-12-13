import random
from datetime import datetime, timedelta
from .extensions import db, bcrypt
from .models import (
    AlarmStatus,
    User,
    UserRole,
    Camera,
    Alarm,
)
import uuid

session = db.session
# An example base 64 encoded image
image_base_64 = "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"


def create_mock_users():
    operator = User.query.filter(
        (User.username == "operator") | (User.email == "john@examplex.com")
    ).first()

    admin = User.query.filter(
        (User.username == "admin") | (User.email == "jane@examplexxx.com")
    ).first()

    manager = User.query.filter(
        (User.username == "manager") | (User.email == "jane@examplexx.com")
    ).first()

    guardian = User.query.filter(
        (User.username == "guardian_of_the_galaxy")
        | (User.email == "sbgubbarna1337@gmail.com")
    ).first()

    if not operator:
        operator = User(
            username="operator",
            password_hash=bcrypt.generate_password_hash("operator").decode("utf-8"),
            role=UserRole.OPERATOR,
            email="john@examplex.com",
        )
        session.add(operator)

    if not manager:
        manager = User(
            username="manager",
            password_hash=bcrypt.generate_password_hash("manager").decode("utf-8"),
            role=UserRole.MANAGER,
            email="jane@examplexx.com",
        )
        session.add(manager)

    if not admin:
        admin = User(
            username="admin",
            password_hash=bcrypt.generate_password_hash("admin").decode("utf-8"),
            role=UserRole.ADMIN,
            email="jane@examplexxx.com",
        )
        session.add(admin)
    if not guardian:
        guardian = User(
            id=uuid.UUID("35ad0eab-2347-404e-a833-d8b2fb0367ff"),
            username="guardian_of_the_galaxy",
            password_hash=bcrypt.generate_password_hash(
                "guardian_of_the_galaxy"
            ).decode("utf-8"),
            role=UserRole.GUARD,
            email="sbgubbarna1337@gmail.com",
        )
        session.add(guardian)

    session.commit()
    return operator, manager, admin, guardian


def create_mock_cameras():
    # Check if camera already exists
    camera1 = Camera.query.filter_by(id="B8A44F9EEE36").first()

    if not camera1:
        camera1 = Camera(
            id="B8A44F9EEE36",  # Camera ID for camera 121
            ip_address="192.168.1.121",
            location="A-huset",
            confidence_threshold=0.5,
            schedule='{"week": {"Monday": [1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0], "Tuesday": [0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1], "Wednesday": [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1], "Thursday": [0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0], "Friday": [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1], "Saturday": [0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0], "Sunday": [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1]}}',
        )
        session.add(camera1)

    # Check if camera already exists
    camera2 = Camera.query.filter_by(id="B8A44F9EEFE0").first()

    if not camera2:
        camera2 = Camera(
            id="B8A44F9EEFE0",  # Camera ID for camera 116
            ip_address="192.168.1.116",
            location="C-huset",
            confidence_threshold=0.5,
            schedule='{"week": {"Monday": [1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0], "Tuesday": [0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1], "Wednesday": [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1], "Thursday": [0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0], "Friday": [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1], "Saturday": [0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0], "Sunday": [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1]}}',
        )
        session.add(camera2)

    session.commit()
    return [camera1, camera2]


def create_mock_alarm(user, camera, statusState):
    # Check if alarm already exists for the given user and camera
    alarm = Alarm.query.filter_by(
        camera_id=camera.id, operator_id=user.id, status=statusState
    ).first()

    if not alarm:
        alarm = Alarm(
            camera_id=camera.id,
            type="Human",
            confidence_score=0.95,
            image_base64=image_base_64,
            status=statusState,
            operator_id=user.id,
        )
        session.add(alarm)

    session.commit()
    return alarm


def create_mock_alarm_extra(user, camera, statusState, time):
    alarm = Alarm(
        camera_id=camera.id,
        type="Human",
        confidence_score=0.95,
        image_base64=image_base_64,
        status=statusState,
        operator_id=user.id,
        timestamp=time,
    )

    session.add(alarm)


def create_random_alarms(user, camera):
    start_date = datetime(2024, 10, 14)
    end_date = datetime(2024, 12, 5)
    num_days = (end_date - start_date).days

    for i in range(num_days):
        current_date = start_date + timedelta(days=i)

        num_alarms_today = random.randint(0, 3)

        for _ in range(num_alarms_today):
            random_time = timedelta(
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59),
                seconds=random.randint(0, 59),
            )
            alarm_timestamp = current_date + random_time

            status = random.choices(
                [AlarmStatus.RESOLVED, AlarmStatus.IGNORED], weights=[0.3, 0.7], k=1
            )[0]

            create_mock_alarm_extra(user, camera, status, alarm_timestamp)
    session.commit()


def create_mock_alarm_test(idtest, user, camera, statusState):
    alarm = Alarm.query.filter_by(id=idtest).first()
    if not alarm:
        alarm = Alarm(
            id=idtest,
            camera_id=camera.id,
            type="Human",
            confidence_score=0.95,
            image_base64=image_base_64,
            status=statusState,
            operator_id=user.id,
        )

        session.add(alarm)
        session.commit()
        return alarm


def create_mock_data():
    operator, _, _, _ = create_mock_users()
    cameras = create_mock_cameras()
    camera = cameras[0]
    create_mock_alarm(operator, camera, AlarmStatus.RESOLVED)
    create_mock_alarm_test(
        uuid.UUID("cc006a17-0852-4e0e-b13c-36e4092f767d"),
        operator,
        camera,
        AlarmStatus.IGNORED,
    )
    create_random_alarms(operator, camera)
    return "Success"


def get_mock_user(user_id):
    return session.query(User).filter_by(id=user_id).first()
