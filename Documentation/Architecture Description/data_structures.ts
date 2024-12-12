// Enum for user roles in the system
enum UserRole {
  OPERATOR = "OPERATOR",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
  GUARD = "GUARD"
}

// Enum for representing the current status of an alarm
enum AlarmStatus {
  PENDING = "PENDING",     // Alarm has been triggered, awaiting response
  NOTIFIED = "NOTIFIED",   // Alarm has been acknowledged and guard has been notified
  RESOLVED = "RESOLVED",   // Alarm has been resolved by a guard
  IGNORED = "IGNORED"      // Alarm has been ignored by an operator
}

// Enum for alarm object types
enum AlarmObjectType {
  HUMAN = "HUMAN",
  FACE = "FACE", 
  VEHICLE = "VEHICLE"
}

// Define a UUID type, using string representation
type UUID = string;


// Represents a user in the system
type User = {
  id: UUID;               // Unique user ID
  username: string;       // Username for login
  password_hash: string;  // Hashed password for secure authentication
  role: UserRole;         // The role of the user
  email: string;          // User's email address
  created_at: Date;       // Date the user account was created

  // Method to expose specific user fields
  exposed_fields?: () => {
    id: string;
    username: string;
    email: string;
    role: string;
  };
};

// Represents a camera in the system
type Camera = {
  id: string;                   // Camera ID (changed from UUID to string)
  ip_address: string;           // IP address of the camera
  location: string;             // Physical location of the camera
  confidence_threshold: number; // Threshold for detection confidence
  schedule?: string;            // Optional schedule for the camera

  // Method to convert camera to dictionary
  to_dict?: () => {
    id: string;
    ip_address: string;
    location: string;
    confidence_threshold: number;
    schedule: string | null;
  };
};

// Represents an alarm event
type Alarm = {
  id: UUID;                 // Unique ID for the alarm
  camera_id: string;        // Foreign key to the camera that triggered the alarm
  type: string;             // Type of alarm object detected
  confidence_score: number; // Confidence score of the detection
  timestamp: Date;          // Timestamp when the alarm was triggered
  image_base64?: string;    // Optional base64 encoded image
  status: AlarmStatus;      // Current status of the alarm
  operator_id?: UUID;       // Optional ID of the operator who responded
  guard_id?: UUID;          // Optional ID of the guard involved
  camera?: Camera;          // Optional associated camera information

  // Method to convert alarm to dictionary
  to_dict?: () => {
    id: string;
    camera_id: string;
    confidence_score: number;
    type: string;
    timestamp: string;
    image_base64: string | null;
    status: string;
    operator_id: string | null;
    guard_id: string | null;
    camera_location: string | null;
  };
};