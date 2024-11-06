import React from 'react';
import liveFootage from '../assets/live-footage.png';

const LiveFeed = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <h2 className="text-xl font-semibold mb-3 text-[#2E5984]">Live feed of Camera : 2</h2>
      <div className="relative w-full max-w-2xl" style={{ height: '65vh' }}> 
        <img src={liveFootage} alt="Live feed" className="w-full h-full object-contain rounded-lg" /> 
      </div>
      <div className="flex space-x-60 mt-4"> 
        <button className="bg-[#237F94] text-white px-6 py-3 rounded-lg hover:bg-[#1E6D7C] transition duration-200">
          Notify the Guard
        </button>
        <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200">
          Dismiss the alert
        </button>
      </div>
    </div>
  );
};

export default LiveFeed;
