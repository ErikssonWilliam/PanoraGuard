// Enum definitions
enum UserRole {
  OPERATOR = "operator",
  MANAGER = "manager",
  ADMIN = "admin",
  GUARD = "guard", // Optional, as mentioned
}

enum AlarmStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELED = "canceled",
}

enum ActionType {
  CONFIRM = "confirm",
  CANCEL = "cancel",
}

enum ScheduleType {
  DAILY = "daily",
  WEEKLY = "weekly",
}

// Type definitions
type UUID = string; // Assuming UUIDs are represented as strings

type User = {
  id: UUID; // Unique user ID
  username: string; // Username for login
  password_hash: string; // Hashed password for authentication
  role: UserRole; // User role
  email: string; // Email address
  created_at: Date; // Date user was created
};

type JWTToken = {
  sub: UUID; // User ID (subject)
  role: UserRole; // User role
  exp: Date; // Token expiration time
};

type ImageSnapshot = {
  id: UUID; // Unique ID for the image snapshot
  url: string; // URL for the image snapshot
  captured_at: Date; // Timestamp when the snapshot was captured
};

type VideoClip = {
  id: UUID; // Unique ID for the video clip
  url: string; // URL for the video clip
  duration: number; // Duration of the video clip in seconds
  captured_at: Date; // Timestamp when the video clip was captured
};

type Alarm = {
  id: UUID; // Unique alarm ID
  camera_id: UUID; // Camera that triggered the alarm
  confidence: number; // Confidence level (0.0 - 1.0)
  timestamp: Date; // Time the alarm was triggered
  location: string; // Fixed location of the camera
  image_snapshot: ImageSnapshot; // Image snapshot details
  video_clip: VideoClip; // Video clip associated with the alarm event
  status: AlarmStatus; // Status of the alarm
  operator?: {
    // Operator details (optional field)
    id: UUID; // Operator ID
    name: string; // Operator name
  };
  actions_taken?: {
    // Actions taken on this alarm (optional field)
    action: ActionType; // Action taken
    timestamp: Date; // Timestamp of the action
  };
};

type Schedule = {
  id: UUID; // Unique schedule ID
  device_id: UUID; // Device being scheduled
  start_date: Date; // When the schedule starts
  end_date: Date; // When the schedule ends
  recurring: boolean; // Whether this is a recurring schedule
  repeat_pattern?: {
    // Defines how often the schedule repeats (optional field)
    type: ScheduleType; // Type of schedule
    days_of_week?: Array<boolean>[7]; // Specific days for weekly schedules
  };
  active_hours: {
    // Defines when the device is active each day
    start_time: Date; // Start time of active hours
    end_time: Date; // End time of active hours
  };
  created_by: {
    // User who created the schedule
    id: UUID; // User ID
    name: string; // User name
  };
};
