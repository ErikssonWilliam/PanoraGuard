from enum import Enum
from datetime import datetime
from sqlalchemy.orm import relationship
from app.extensions import db
import uuid
from sqlalchemy.dialects.postgresql import UUID


class UserRole(Enum):
    OPERATOR = "OPERATOR"
    MANAGER = "MANAGER"
    ADMIN = "ADMIN"
    GUARD = "GUARD"


class AlarmStatus(Enum):
    # Enum for representing the current status of an alarm.
    PENDING = "PENDING"  # Alarm has been triggered, awaiting response
    NOTIFIED = "NOTIFIED"  # Alarm has been acknowledged and guard has been notified
    RESOLVED = "RESOLVED"  # Alarm has been resolved by a guard
    IGNORED = "IGNORED"  # Alarm has been ignored by an operator


class AlarmObjectType(Enum):
    HUMAN = "HUMAN"
    FACE = "FACE"
    VEHICLE = "VEHICLE"


##################################################
###### Below is data stored in the database ######
##################################################


# Represents a user in the system, such as an operator or manager.
class User(db.Model):
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
class Camera(db.Model):
    __tablename__ = "cameras"
    id = db.Column(db.String, primary_key=True)
    ip_address = db.Column(db.String(45), nullable=False)
    location = db.Column(db.String(120), nullable=False)
    confidence_threshold = db.Column(db.Float, nullable=False)
    schedule = db.Column(db.String, nullable=True)

    def to_dict(self):
        return {
            "id": str(self.id),
            "ip_address": str(self.ip_address),
            "location": self.location,
            "confidence_threshold": self.confidence_threshold,
            "schedule": self.schedule,
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
    guard_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=True)
    camera = relationship("Camera", backref="alarms")

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
            "guard_id": str(self.guard_id) if self.guard_id else None,
            "camera_location": self.camera.location if self.camera else None,
        }
