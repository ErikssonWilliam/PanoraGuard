from .extensions import db
from .models import *

session = db.session


def create_mock_image_snapshot():
    image_snapshot = ImageSnapshot(
        url="/Users/olofswedberg/Desktop/Screenshot 2024-09-28 at 19.25.07.png"
    )
    session.add(image_snapshot)
    session.commit()
    return image_snapshot


def create_mock_video_clip():
    video_clip = VideoClip(url="https://MockVideo.com/video.mp4", duration=120)
    session.add(video_clip)
    session.commit()
    return video_clip


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
        id="35ad0eab-2347-404e-a833-d8b2fb0367ff",
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


def create_mock_alarm(user, image_snapshot, video_clip, camera, statusState):
    alarm = Alarm(
        camera_id=camera.id,
        confidence_score=0.95,
        image_snapshot_id=image_snapshot.id,
        video_clip_id=video_clip.id,
        status=statusState,
        operator_id=user.id,
    )

    session.add(alarm)
    session.commit()
    return alarm


def create_mock_alarm_test(idtest, user, image_snapshot, video_clip, camera, statusState):
    alarm = Alarm(
        id=idtest,
        camera_id=camera.id,
        confidence_score=0.95,
        image_snapshot_id=image_snapshot.id,
        video_clip_id=video_clip.id,
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
    image = create_mock_image_snapshot()
    video = create_mock_video_clip()
    user1, user2, user3 = create_mock_users()
    camera = create_mock_camera()
    alarm = create_mock_alarm(user1, image, video, camera, AlarmStatus.PENDING)
    alarm2 = create_mock_alarm_test(
        "cc006a17-0852-4e0e-b13c-36e4092f767d", user1, image, video, camera, AlarmStatus.CANCELED)
    alarm3 = create_mock_alarm(
        user1, image, video, camera, AlarmStatus.CANCELED)
    alarm4 = create_mock_alarm(
        user1, image, video, camera, AlarmStatus.CANCELED)
    alarm5 = create_mock_alarm(
        user1, image, video, camera, AlarmStatus.CANCELED)
    alarm6 = create_mock_alarm(
        user1, image, video, camera, AlarmStatus.CANCELED)
    cameraControlAction = create_mock_camera_control_action(camera, user1)
    return "Success"


def get_mock_user(user_id):
    return session.query(User).filter_by(id=user_id).first()
