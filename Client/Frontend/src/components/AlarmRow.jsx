import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import cameraIcon from '../assets/camera-03.png';
import locationIcon from '../assets/location-icon.png';
import detectIcon from '../assets/detect-icon.png';

const AlarmRow = ({ id, camera_id, confidence_score, status, timestamp }) => {
  const navigate = useNavigate(); 

  const handleDetailsClick = () => {
    navigate('/alert-details', { state: { id } }); // Sends ID as state
  };

  return (
    <div className="bg-gray-300 p-2 mb-4 rounded-lg shadow-md max-w-5xl mx-auto"> 
      <div className="flex items-center justify-between space-x-4">
        <span className="flex items-center justify-center min-w-[200px] bg-white p-3 rounded-lg shadow">
          <img src={cameraIcon} alt="Camera icon" className="mr-2 w-4 h-4 object-contain" />
          <span className="text-sm font-medium text-gray-700">Camera ID: {camera_id || "Unknown Camera"}</span>
        </span>

        <span className="flex items-center justify-center min-w-[200px] bg-white p-3 rounded-lg shadow">
          <img src={locationIcon} alt="Location icon" className="mr-2 w-4 h-4 object-contain" />
          <span className="text-sm font-medium text-gray-700">Location: {"Unknown Location"}</span>
        </span>

        <span className="flex items-center justify-center min-w-[200px] bg-white p-3 rounded-lg shadow">
          <img src={detectIcon} alt="Detection icon" className="mr-2 w-4 h-4 object-contain" />
          <span className="text-sm font-medium text-gray-700">Detected: {"Human"}</span>
        </span>

        {status === "pending" ? (
          <span 
            className="flex items-center justify-center min-w-[200px] bg-red-600 text-white p-3 rounded-lg shadow hover:bg-red-500 transition duration-200"
            title="This alarm is currently active"
          >
            Active Alarm
          </span>
        ) : (
          <span className="flex items-center justify-center min-w-[200px] bg-white text-gray-600 p-3 rounded-lg shadow">
            Status: {status}
          </span>
        )}
        
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
