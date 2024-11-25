import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import cameraIcon from "../assets/camera-03.png";
import locationIcon from "../assets/location-icon.png";
import detectIcon from "../assets/detect-icon.png";
import { externalURL } from "../api/axiosConfig";

const AlarmRow = ({ id }) => {
  const navigate = useNavigate();
  const [alarm, setAlarm] = useState(null);

  useEffect(() => {
    // Gets alarm data based on ID
    const fetchAlarmDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${externalURL}/alarms/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAlarm(response.data);
      } catch (error) {
        console.error("Error fetching alarm details:", error);
      }
    };

    if (id) {
      fetchAlarmDetails();
    }
  }, [id]); // Runs when ID is changed

  useEffect(() => {
    // Gets alarm data based on ID
    const fetchAlarmDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${externalURL}/alarms/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAlarm(response.data);
      } catch (error) {
        console.error("Error fetching alarm details:", error);
      }
    };

    if (id) {
      fetchAlarmDetails();
    }
  }, [id]); // Runs when ID is changed

  const handleDetailsClick = () => {
    navigate("/alert-details", { state: { id } }); // Sends ID as state
  };

  const getStatusClass = () => {
    if (alarm.status === "PENDING") {
      return "bg-red-600 hover:bg-red-500";
    } else if (alarm.status === "NOTIFIED") {
      return "bg-[#7E8736] hover:bg-[#575F1D]"; // Yellow for notified
    } else if (alarm.status === "RESOLVED") {
      return "bg-[#216657] hover:bg-[#12493D]"; // Green for resolved
    } else if (alarm.status === "IGNORED") {
      return "bg-[#788D8E] hover:bg-[#5F6C6C]"; // Dark gray for ignored
    }
  };

  return (
    alarm && (
      <div className="bg-gray-300 p-2 mb-4 rounded-lg shadow-md max-w-5xl mx-auto">
        <div className="flex items-center justify-between space-x-4">
          <span className="flex items-center justify-center min-w-[200px] bg-white p-3 rounded-lg shadow">
            <img
              src={cameraIcon}
              alt="Camera icon"
              className="mr-2 w-4 h-4 object-contain"
            />
            <span className="text-sm font-medium text-gray-700">
              Camera: {alarm.camera_id || "Unknown Camera"}{" "}
              {/* Camera = Camera ID */}
            </span>
          </span>

          <span className="flex items-center justify-center min-w-[200px] bg-white p-3 rounded-lg shadow">
            <img
              src={locationIcon}
              alt="Location icon"
              className="mr-2 w-4 h-4 object-contain"
            />
            <span className="text-sm font-medium text-gray-700">
              Location: {alarm.camera_location || "Unknown Location"}
            </span>
          </span>

          <span className="flex items-center justify-center min-w-[200px] bg-white p-3 rounded-lg shadow">
            <img
              src={detectIcon}
              alt="Detection icon"
              className="mr-2 w-4 h-4 object-contain"
            />
            <span className="text-sm font-medium text-gray-700">
              Detected: {alarm.type || "N/A"}
            </span>
          </span>

          <span
            className={`flex items-center justify-center min-w-[200px] ${getStatusClass()} text-white p-3 rounded-lg shadow transition duration-200`}
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
            className="bg-[#237F94] text-white px-4 py-3 rounded-lg hover:bg-[#1E6D7C] transition duration-200 min-w-[130px]"
          >
            Details
          </button>
        </div>
      </div>
    )
  );
};

export default AlarmRow;
