// Enum for user roles in the system. Guards are optional based on your setup.
enum UserRole {
  OPERATOR = "operator",
  MANAGER = "manager",
  ADMIN = "admin",
  GUARD = "guard", // Optional role
}

// Enum for representing the current status of an alarm.
enum AlarmStatus {
  PENDING = "pending", // Alarm has been triggered, awaiting response
  CONFIRMED = "confirmed", // Alarm has been acknowledged and confirmed
  CANCELED = "canceled", // Alarm has been canceled, no action needed
}

// Enum for controlling various camera settings.
enum CameraControlType {
  BRIGHTNESS = "brightness",
  ACTIVE_STATUS = "active_status", // For activating or deactivating cameras
  ZOOM_LEVEL = "zoom_level",
  // More settings can be added as necessary
}

// Define a UUID type, assuming it's stored as a string in your system.
type UUID = string;

// JWTToken structure for authenticating users. It contains essential user information and
// the token's expiration time.
type JWTToken = {
  sub: UUID; // The user's ID (subject of the token)
  role: UserRole; // The role of the user (e.g., operator, manager)
  exp: Date; // Expiration time of the token
};

/////////////////////////////////////  Types that are defined below will be stored in the database  //////////////////////////////////////////////////

// Represents an image snapshot taken during an alarm event.
// Assumes the URL points to an object stored in a object storage cloud service.
type ImageSnapshot = {
  id: UUID; // Unique ID for the image snapshot
  url: string; // URL of the image snapshot in object storage (e.g., S3 bucket)
  captured_at: Date; // Timestamp of when the snapshot was taken
};

// Represents a video clip associated with an alarm event.
// Assumes the URL points to a video object stored in a object storage cloud service.
type VideoClip = {
  id: UUID; // Unique ID for the video clip
  url: string; // URL of the video clip in object storage (e.g., S3 bucket)
  duration: number; // Duration of the video clip in seconds
  captured_at: Date; // Timestamp of when the video clip was recorded
};

// Represents a user in the system, such as an operator or manager.
type User = {
  id: UUID; // Unique user ID
  username: string; // Username for login
  password_hash: string; // Hashed password for secure authentication
  role: UserRole; // The role of the user (operator, manager, etc.)
  email: string; // User's email address for communication and notifications
  created_at: Date; // Date the user account was created
};

// Represents a camera in the system, which triggers alarms.
type Camera = {
  id: UUID; // Unique camera ID
  ip_address: string; // IP address of the camera in the network
  location: string; // Physical location of the camera (latitude/longitude or address)
};

// The Alarm structure stores metadata about an alarm event and its associations.
// The operator_id is optional, meaning it will only be populated when an operator responds to the alarm.
type Alarm = {
  id: UUID; // Unique ID for the alarm
  camera_id: UUID; // Foreign key to the camera that triggered the alarm (required)
  confidence_score: number; // Confidence score (0.0 - 1.0) indicating the accuracy of the detection
  timestamp: Date; // Timestamp when the alarm was triggered
  image_snapshot_id: UUID; // Foreign key to the associated image snapshot (if applicable)
  video_clip_id?: UUID; // Foreign key to the associated video clip (if applicable) (can make it optional as well)
  status: AlarmStatus; // Current status of the alarm (pending, confirmed, canceled)
  operator_id?: UUID; // Optional foreign key to the operator who responded (can be null initially)
};

type CameraControlAction = {
  id: UUID; // Unique action ID
  camera_id: UUID; // Foreign key to the camera being controlled
  initiated_by: UUID; // Foreign key to the user who initiated the action
  control_type: CameraControlType; // Type of control (brightness, zoom, active status, etc.)
  value: string; // The value to set (number for brightness/zoom, boolean for active status) (will be interpreted from string)
  timestamp: Date; // Time when the control action was initiated
};

//To be decided later(need research on vapix documentation)
//
//
// enum ScheduleType {
//   DAILY = "daily",
//   WEEKLY = "weekly",
// }
//
//
// type Schedule = {
//   id: UUID; // Unique schedule ID
//   device_id: UUID; // Device being scheduled
//   start_date: Date; // When the schedule starts
//   end_date: Date; // When the schedule ends
//   recurring: boolean; // Whether this is a recurring schedule
//   repeat_pattern?: {
//     // Defines how often the schedule repeats (optional field)
//     type: ScheduleType; // Type of schedule
//     days_of_week?: Array<boolean>[7]; // Specific days for weekly schedules
//   };
//   active_hours: {
//     // Defines when the device is active each day
//     start_time: Date; // Start time of active hours
//     end_time: Date; // End time of active hours
//   };
//   created_by: {
//     // User who created the schedule
//     id: UUID; // User ID
//     name: string; // User name
//   };
// };
