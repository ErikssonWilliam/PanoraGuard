from .database import db
from .models import *
from datetime import datetime

session = db.session


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


def create_mock_image_snapshot():
    image_snapshot = ImageSnapshot(
        # Will it work with URL? Can't see image in database // Olof
        url="/Users/olofswedberg/Desktop/Screenshot 2024-09-28 at 19.25.07.png"
    )
    session.add(image_snapshot)
    session.commit()
    return image_snapshot


def create_mock_video_clip():
    video_clip = VideoClip(
        url="https://MockVideo.com/video.mp4",
        duration=120
    )
    session.add(video_clip)
    session.commit()
    return video_clip


def create_mock_alarm(user, image_snapshot, video_clip):
    alarm = Alarm(
        camera_id=uuid.uuid4(),
        confidence=0.95,
        timestamp=datetime.now(),
        location="A-house",
        image_snapshot_id=image_snapshot.id,
        video_clip_id=video_clip.id,
        status=AlarmStatus.PENDING,
        operator_id=user.id
    )

    session.add(alarm)
    session.commit()
    return alarm


def create_mock_alarm_action(alarm, action_type):
    alarm_action = AlarmAction(
        alarm_id=alarm.id,
        action=action_type,
        timestamp=datetime.now()
    )

    session.add(alarm_action)
    session.commit()
    return alarm_action


def create_mock_schedule(user):
    schedule = Schedule(
        # This should be reconstructed so that it takes the camera ID (which is UUID)
        device_id=uuid.uuid4(),
        start_date=datetime.now(),
        end_date=datetime.now(),
        recurring=True,
        schedule_type=ScheduleType.DAILY,
        created_by_id=user.id,
        active_hours_start=datetime.strptime("17:00", "%H:%M").time(),
        active_hours_end=datetime.strptime("08:00", "%H:%M").time()
    )
    session.add(schedule)
    session.commit()
    return schedule


def create_mock_data():
    user1, user2 = create_mock_users()
    image = create_mock_image_snapshot()
    video = create_mock_video_clip()
    alarm = create_mock_alarm(user1, image, video)
    create_mock_alarm_action(alarm, ActionType.CONFIRM)
    create_mock_schedule(user2)
    return "Success"


def get_mock_user(user_id):
    return session.query(User).filter_by(id=user_id).first()
