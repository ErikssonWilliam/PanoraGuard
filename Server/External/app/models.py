from enum import Enum
from datetime import datetime
from dataclasses import dataclass
from .database import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

# Enums for the different roles and statuses
class UserRole(Enum):
    OPERATOR = "operator"
    MANAGER = "manager"
    ADMIN = "admin"
    GUARD = "guard"

class AlarmStatus(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELED = "canceled"

class ActionType(Enum):
    CONFIRM = "confirm"
    CANCEL = "cancel"

class ScheduleType(Enum):
    DAILY = "daily"
    WEEKLY = "weekly"

# User model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ImageSnapshot model
class ImageSnapshot(db.Model):
    __tablename__ = 'image_snapshots'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    url = db.Column(db.String, nullable=False)
    captured_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

# VideoClip model
class VideoClip(db.Model):
    __tablename__ = 'video_clips'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    url = db.Column(db.String, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    captured_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

# Alarm model
class Alarm(db.Model):
    __tablename__ = 'alarms'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    camera_id = db.Column(UUID(as_uuid=True), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    location = db.Column(db.String, nullable=False)
    image_snapshot_id = db.Column(UUID(as_uuid=True), db.ForeignKey('image_snapshots.id'))
    video_clip_id = db.Column(UUID(as_uuid=True), db.ForeignKey('video_clips.id'))
    status = db.Column(db.Enum(AlarmStatus), nullable=False)
    operator_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    actions_taken = db.relationship('AlarmAction', backref='alarm')

# AlarmAction model
class AlarmAction(db.Model):
    __tablename__ = 'alarm_actions'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    alarm_id = db.Column(UUID(as_uuid=True), db.ForeignKey('alarms.id'))
    action = db.Column(db.Enum(ActionType), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Schedule model
class Schedule(db.Model):
    __tablename__ = 'schedules'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    device_id = db.Column(UUID(as_uuid=True), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    recurring = db.Column(db.Boolean, nullable=False, default=False)
    schedule_type = db.Column(db.Enum(ScheduleType))
    created_by_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    active_hours_start = db.Column(db.Time, nullable=False)
    active_hours_end = db.Column(db.Time, nullable=False)
