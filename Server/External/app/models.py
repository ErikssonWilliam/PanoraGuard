from enum import Enum
from datetime import datetime
from dataclasses import dataclass
from app.extensions import db
import uuid
from sqlalchemy.dialects.postgresql import UUID
from uuid import UUID as UUIDType


class UserRole(Enum):
    # Enum for user roles
    OPERATOR = "operator"
    MANAGER = "manager"
    ADMIN = "admin"
    GUARD = "guard"


class AlarmStatus(Enum):
    # Enum for representing the current status of an alarm.
    PENDING = "pending"  # Alarm has been triggered, awaiting response
    NOTIFIED = "notified"  # Alarm has been acknowledged and guard has been notified
    RESOLVED = "resolved"  # Alarm has been resolved by a guard
    IGNORED = "ignored"  # Alarm has been ignored by an operator
    # Old alarms will be archived as either resolved or ignored


class CameraControlType(Enum):
    # Enum for camera control settings
    BRIGHTNESS = "brightness"
    ACTIVE_STATUS = "active_status"  # For activating or deactivating cameras
    ZOOM_LEVEL = "zoom_level"
    # More settings can be added as necessary


@dataclass
class JWTToken:
    # @Gustav Alsenhed, Unsure whether this one is needed /Olof
    sub: UUIDType  # User's ID
    role: UserRole  # User's role
    exp: datetime  # Expiration time


##################################################
###### Below is data stored in the database ######
##################################################


# Represents a user in the system, such as an operator or manager.
class User(db.Model):
    # Class for user
    __tablename__ = "users"
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def exposed_fields(self):
        return {
            "id": str(self.id),
            "username": self.username,
            "email": self.email,
            "role": self.role.name,
        }


# Represents a camera in the system, which triggers alarms.
# Camera Model
class Camera(db.Model):
    # Class for camera
    __tablename__ = "cameras"
    id = db.Column(db.String, primary_key=True)
    ip_address = db.Column(db.String(45), nullable=False)
    location = db.Column(db.String(120), nullable=False)
    confidence_threshold = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "id": str(self.id),
            "ip_address": str(self.ip_address),
            "location": self.location,
            "confidence_threshold": self.confidence_threshold,
        }


# The Alarm structure stores metadata about an alarm event and its associations.
# The operator_id is optional, meaning it will only be populated when an operator responds to the alarm.
class Alarm(db.Model):
    __tablename__ = "alarms"
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    camera_id = db.Column(db.String, db.ForeignKey("cameras.id"), nullable=False)
    type = db.Column(db.String, nullable=False)
    confidence_score = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    image_base64 = db.Column(db.String, nullable=True)
    status = db.Column(db.Enum(AlarmStatus), nullable=False)
    operator_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=True
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "camera_id": str(self.camera_id),
            "confidence_score": self.confidence_score,
            "type": self.type,
            "timestamp": self.timestamp.isoformat(),
            "image_base64": self.image_base64,
            "status": self.status.value,
            "operator_id": str(self.operator_id) if self.operator_id else None,
        }


# ToDo: The alarm shoud NOT have video_clip_id and image_snapshot_id as attributes/relationships...?
# Also: Add type to the alarm; Human, Vehicle, Face, etc.?


class CameraControlAction(db.Model):
    # Class for camera control action
    __tablename__ = "camera_control_actions"
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    camera_id = db.Column(db.String, db.ForeignKey("cameras.id"), nullable=False)
    initiated_by = db.Column(
        UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False
    )
    control_type = db.Column(db.Enum(CameraControlType), nullable=False)
    value = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


# Schedule model and status TBD at a later stage #

# class ScheduleType(Enum):
#     DAILY = "daily"
#     WEEKLY = "weekly"

# class Schedule(db.Model):
#     __tablename__ = 'schedules'
#     id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     device_id = db.Column(UUID(as_uuid=True), nullable=False)
#     start_date = db.Column(db.DateTime, nullable=False)
#     end_date = db.Column(db.DateTime, nullable=False)
#     recurring = db.Column(db.Boolean, nullable=False, default=False)
#     schedule_type = db.Column(db.Enum(ScheduleType))
#     created_by_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
#     active_hours_start = db.Column(db.Time, nullable=False)
#     active_hours_end = db.Column(db.Time, nullable=False)
