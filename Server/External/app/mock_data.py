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
        username="john_doe",
        password_hash="hashed_password123",
        role=UserRole.OPERATOR,
        email="john@example.com",
    )

    user2 = User(
        username="jane_doe",
        password_hash="hashed_password456",
        role=UserRole.MANAGER,
        email="jane@example.com",
    )

    session.add(user1)
    session.add(user2)
    session.commit()
    return user1, user2


def create_mock_camera():
    camera = Camera(ip_address="HTTPS//127.123.etc", location="A-huset")
    session.add(camera)
    session.commit()
    return camera


def create_mock_alarm(user, image_snapshot, video_clip, camera):
    alarm = Alarm(
        camera_id=camera.id,
        confidence_score=0.95,
        image_snapshot_id=image_snapshot.id,
        video_clip_id=video_clip.id,
        status=AlarmStatus.PENDING,
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
    user1, user2 = create_mock_users()
    camera = create_mock_camera()
    alarm = create_mock_alarm(user1, image, video, camera)
    cameraControlAction = create_mock_camera_control_action(camera, user1)
    return "Success"


def get_mock_user(user_id):
    return session.query(User).filter_by(id=user_id).first()
