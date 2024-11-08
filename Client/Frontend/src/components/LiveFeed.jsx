import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import liveFootage from '../assets/live-footage.png';

const LiveFeed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // Gets id from location.state if it exists
  const id = location.state?.id;

  const updateAlarmStatus = async (newStatus) => {
    try {
      if (!id) {
        setError('Alarm ID is missing.');
        return;
      }

      const response = await axios.put(`http://127.0.0.1:5000/alarms/${id}/status`, {
        status: newStatus,
      });
      console.log(`Alarm status updated to ${newStatus}:`, response.data);
    } catch (err) {
      console.error(`Error updating alarm status to ${newStatus}:`, err);
      setError(`Failed to update status to ${newStatus}.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <h2 className="text-xl font-semibold mb-3 text-[#2E5984]">Live feed of Camera : 2</h2>
      <div className="relative w-full max-w-2xl" style={{ height: '65vh' }}> 
        <img src={liveFootage} alt="Live feed" className="w-full h-full object-contain rounded-lg" /> 
      </div>
      <div className="flex space-x-60 mt-4"> 
        <button 
          onClick={() => updateAlarmStatus('notified')} // Updated to match new status
          className="bg-[#237F94] text-white px-6 py-3 rounded-lg hover:bg-[#1E6D7C] transition duration-200"
        >
          Notify the Guard
        </button>
        <button 
          onClick={() => updateAlarmStatus('ignored')} // Updated to match new status
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200"
        >
          Dismiss the alert
        </button>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default LiveFeed;
