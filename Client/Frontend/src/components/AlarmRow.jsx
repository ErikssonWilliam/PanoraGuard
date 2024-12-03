import { useNavigate } from "react-router-dom";
import cameraIcon from "../assets/camera-03.png";
import locationIcon from "../assets/location-icon.png";
import detectIcon from "../assets/detect-icon.png";

const AlarmRow = ({ alarm }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate("/alarm-details", { state: { alarm: alarm } });
  };

  const getStatusClass = () => {
    if (alarm.status === "PENDING") {
      return "bg-red-600";
    } else if (alarm.status === "NOTIFIED") {
      return "bg-[#7E8736]"; // Yellow for notified
    } else if (alarm.status === "RESOLVED") {
      return "bg-[#216657]"; // Green for resolved
    } else if (alarm.status === "IGNORED") {
      return "bg-[#788D8E]"; // Dark gray for ignored
    }
  };

  return (
    alarm && (
      <div className="bg-gray-300 p-2 mb-4 rounded-lg shadow-md max-w-5xl mx-auto">
        <div className="flex md:grid md:grid-cols-5 md:gap-4 items-center justify-between space-x-4 xs:flex-wrap">
          <div className="flex md:col-span-1 items-center justify-center min-w-[200px] bg-white p-3 rounded-lg shadow">
            <img
              src={cameraIcon}
              alt="Camera icon"
              className="mr-2 w-4 h-4 object-contain"
            />
            <span className="text-sm font-medium text-gray-700">
              Camera: {alarm.camera_id || "Unknown Camera"}{" "}
              {/* Camera = Camera ID */}
            </span>
          </div>

          <div className="flex md:col-span-1 items-center justify-center min-w-[200px] bg-white p-3 rounded-lg shadow">
            <img
              src={locationIcon}
              alt="Location icon"
              className="mr-2 w-4 h-4 object-contain"
            />
            <span className="text-sm font-medium text-gray-700">
              Location: {alarm.camera_location || "Unknown Location"}
            </span>
          </div>

          <div className="flex md:col-span-1 items-center justify-center min-w-[200px] bg-white p-3 rounded-lg shadow">
            <img
              src={detectIcon}
              alt="Detection icon"
              className="mr-2 w-4 h-4 object-contain"
            />
            <span className="text-sm font-medium text-gray-700">
              Detected: {alarm.type || "N/A"}
            </span>
          </div>

          <span
            className={`flex items-center justify-center min-w-[200px] ${getStatusClass()} text-white p-3 rounded-lg`}
            title={
              alarm.status === "PENDING"
                ? "This alarm is currently active"
                : alarm.status === "NOTIFIED"
                  ? "This alarm is under investigation"
                  : alarm.status === "RESOLVED"
                    ? "This alarm has been resolved"
                    : alarm.status === "IGNORED"
                      ? "This alarm has been ignored"
                      : "Unknown status"
            }
          >
            {alarm.status === "PENDING"
              ? "Active Alarm"
              : alarm.status === "NOTIFIED"
                ? "Notified"
                : alarm.status === "RESOLVED"
                  ? "Resolved Alarm"
                  : alarm.status === "IGNORED"
                    ? "Ignored"
                    : "Unknown"}
          </span>

          <button
            onClick={handleDetailsClick}
            className=" bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-3 rounded-lg transition duration-200 min-w-[130px]"
          >
            Details
          </button>
        </div>
      </div>
    )
  );
};

export default AlarmRow;
