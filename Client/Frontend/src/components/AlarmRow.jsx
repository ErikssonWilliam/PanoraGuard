// AlarmRow.js
import React from "react";
import { useNavigate } from "react-router-dom";
import cameraIcon from "../assets/camera-03.png";
import locationIcon from "../assets/location-icon.png";
import detectIcon from "../assets/detect-icon.png";

const AlarmRow = ({ id, camera_id, confidence_score, status, timestamp, type }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate("/alert-details", { state: { id } }); // Sends ID as state
  };

  const getStatusClass = () => {
    if (status === "pending") {
      return "bg-red-600 hover:bg-red-500";
    } else if (status === "notified") {
      return "bg-yellow-500 hover:bg-yellow-400"; // Yellow for notified
    } else if (status === "resolved") {
      return "bg-green-500 hover:bg-green-400"; // Green for resolved 
    }

  };

  return (
    <div className="bg-gray-300 p-2 mb-4 rounded-lg shadow-md max-w-5xl mx-auto">
      <div className="flex items-center justify-between space-x-4">
        <span className="flex items-center justify-center min-w-[200px] bg-white p-3 rounded-lg shadow">
          <img
            src={cameraIcon}
            alt="Camera icon"
            className="mr-2 w-4 h-4 object-contain"
          />
          <span className="text-sm font-medium text-gray-700">
            Camera ID: {camera_id || "Unknown Camera"}
          </span>
        </span>

        <span className="flex items-center justify-center min-w-[200px] bg-white p-3 rounded-lg shadow">
          <img
            src={locationIcon}
            alt="Location icon"
            className="mr-2 w-4 h-4 object-contain"
          />
          <span className="text-sm font-medium text-gray-700">
            Location: {"Unknown Location"}
          </span>
        </span>

        <span className="flex items-center justify-center min-w-[200px] bg-white p-3 rounded-lg shadow">
          <img
            src={detectIcon}
            alt="Detection icon"
            className="mr-2 w-4 h-4 object-contain"
          />
          <span className="text-sm font-medium text-gray-700">
            Detected: {type}
          </span>
        </span>

        <span
          className={`flex items-center justify-center min-w-[200px] ${getStatusClass()} text-white p-3 rounded-lg shadow transition duration-200`}
          title={
            status === "pending"
              ? "This alarm is currently active"
              : status === "notified"
              ? "This alarm is under investigation"
              : "This alarm has been resolved"
          }
        >
          {status === "pending"
            ? "Active Alarm"
            : status === "notified"
            ? "Notified"
            : `Resolved Alarm`}
        </span>

        <button
          onClick={handleDetailsClick}
          className="bg-[#237F94] text-white px-4 py-3 rounded-lg hover:bg-[#1E6D7C] transition duration-200 min-w-[130px]"
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default AlarmRow;
