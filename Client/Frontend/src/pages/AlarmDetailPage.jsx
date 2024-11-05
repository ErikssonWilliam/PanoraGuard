import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import liveFootage from '../assets/live-footage.png';
import Header from '../components/OperatorHeader';

const AlarmDetailPage = () => {
  const navigate = useNavigate(); 

  return (
    <div className="bg-custom-bg min-h-screen flex flex-col"> 
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="flex w-11/12 justify-between bg-custom-bg max-w-6xl">
          <div className="w-2/5">
            <img src={liveFootage} alt="Live footage" className="w-full h-auto rounded-lg" />
          </div>
          <div className="w-2/5 bg-gray-200 rounded-lg p-2 ml-2"> 
            <p className="text-xl font-semibold mb-2">Alert number: 3</p>
            <p className="text-lg">Camera number: 2</p>
            <p className="text-lg">Location: Floor 3, Stockholm Convention</p>
            <p className="text-lg">Detected: Human</p>
            <p className="text-lg">First occurrence: 10:00 PM</p>
            <p className="text-lg mb-2">Last occurrence: 10:12 PM</p>
            <p className="text-lg mb-2">Confidence Level: 60%</p>
            <p className="text-lg">Guard Responsible: John Doe</p>
          </div>
        </div>
        <div className="flex justify-between w-10/12 max-w-6xl mt-6">
          <button 
            onClick={() => navigate('/live-feed')} 
            className="bg-[#237F94] text-white px-6 py-3 rounded-lg hover:bg-[#1E6D7C] transition duration-200"
          >
            Look at the live feed
          </button>
          <button className="bg-[#237F94] text-white px-6 py-3 rounded-lg hover:bg-[#1E6D7C] transition duration-200">
            Notify the Guard
          </button>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200">
            Dismiss the alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmDetailPage;
