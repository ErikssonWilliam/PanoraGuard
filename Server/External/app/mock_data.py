from .database import db
from .models import *
from datetime import datetime

session = db.session

# Create mock user


def create_mock_users():
    user1 = User(
        username="john_doe",
        password_hash="hashed_password123",
        role=UserRole.OPERATOR,
        email="john@example.com",
        created_at=datetime.now()
    )

    user2 = User(
        username="jane_doe",
        password_hash="hashed_password456",
        role=UserRole.MANAGER,
        email="jane@example.com",
        created_at=datetime.now()
    )

    session.add(user1)
    session.add(user2)
    session.commit()
    return user1, user2


# Create a mock image snapshot
def create_mock_image_snapshot():
    image_snapshot = ImageSnapshot(
        # Will it work with URL? Can't see image in database // Olof
        url="/Users/olofswedberg/Desktop/Screenshot 2024-09-28 at 19.25.07.png",
        # captured_at=datetime.now()
    )
    session.add(image_snapshot)
    session.commit()
    return image_snapshot

# Create a mock video clip


def create_mock_video_clip():
    video_clip = VideoClip(
        url="https://MockVideos.com/video.mp4",
        duration=120,
        # captured_at=datetime.now()
    )
    session.add(video_clip)
    session.commit()
    return video_clip

# Create a mock alarm


def create_mock_alarm(user, image_snapshot, video_clip):
    alarm = Alarm(
        camera_id="1",
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

# Create a mock alarm action


def create_mock_alarm_action(alarm, action_type):
    alarm_action = AlarmAction(
        alarm_id=alarm.id,
        action=action_type,
        timestamp=datetime.now()
    )

    session.add(alarm_action)
    session.commit()
    return alarm_action

# Create a mock schedule


def create_mock_schedule(user):
    schedule = Schedule(
        # This should be reconstructed so that it takes the camera ID (which is UUID)
        device_id="1",
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
    try:
        user1, user2 = create_mock_users()
        print(f"Created users: {user1}, {user2}")

        image = create_mock_image_snapshot()
        print(f"Created image snapshot: {image}")

        video = create_mock_video_clip()
        print(f"Created video clip: {video}")

        alarm = create_mock_alarm(user1, image, video)
        print(f"Created alarm: {alarm}")

        alarm_action = create_mock_alarm_action(alarm, ActionType.CONFIRM)
        print(f"Created alarm action: {alarm_action}")

        schedule = create_mock_schedule(user2)
        print(f"Created schedule: {schedule}")

    except Exception as e:
        print(f"An error occurred: {e}")
        session.rollback()  # Rollback the session in case of an error


# def create_mock_data():
#     user1, user2 = create_mock_users()
#     image = create_mock_image_snapshot()
#     video = create_mock_video_clip()
#     alarm = create_mock_alarm(user1, image, video)
#     create_mock_alarm_action(alarm, ActionType.CONFIRM)
#     create_mock_schedule(user2)
