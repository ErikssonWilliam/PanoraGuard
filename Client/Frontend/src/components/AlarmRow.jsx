import { useNavigate } from "react-router-dom";
import cameraIcon from "../assets/camera-03.png";
import locationIcon from "../assets/location-icon.png";
import detectIcon from "../assets/detect-icon.png";

const AlarmRow = ({ alarm }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate("/alarm-details", { state: { alarm: alarm } });
  };

  // Colors for the alarms
  const getStatusClass = () => {
    if (alarm.status === "PENDING") {
      return "bg-NewRed";
    } else if (alarm.status === "NOTIFIED") {
      return "bg-white border-NewYellow border-4"; // Yellow for notified
    } else if (alarm.status === "RESOLVED") {
      return "bg-white border-[#369161] border-4 "; // Green for resolved
    } else if (alarm.status === "IGNORED") {
      return "bg-white border-[#454545] border-4"; // Dark gray for ignored
    }
  };

  return (
    alarm && (
      <div className="bg-gray-300 p-2 mb-4 rounded-lg shadow-md max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-9 items-center">
          <div className="flex items-center justify-center bg-white p-3 rounded-lg shadow min-w-[200px]">
            <img
              src={detectIcon}
              alt="Detection icon"
              className="mr-2 w-4 h-4 object-contain"
            />
            <span className="text-sm font-medium text-gray-700">
              {alarm.timestamp !== "N/A"
                ? new Date(alarm.timestamp).toLocaleString()
                : "N/A"}
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
              src={cameraIcon}
              alt="Camera icon"
              className="mr-2 w-4 h-4 object-contain"
            />
            <span className="text-sm font-medium text-gray-700">
              Camera: {alarm.camera_id || "Unknown Camera"}{" "}
            </span>
          </div>

          <span
            className={`flex md:col-span-1 items-center justify-center min-w-[200px] h-11 bg-white p-3 rounded-lg shadow`}
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
              ? "Active"
              : alarm.status === "NOTIFIED"
                ? "Notified"
                : alarm.status === "RESOLVED"
                  ? "Resolved"
                  : alarm.status === "IGNORED"
                    ? "Ignored"
                    : "Unknown"}
            <div
              className={"w-4 h-4 ml-2 rounded-full " + getStatusClass() + ""}
            ></div>
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
