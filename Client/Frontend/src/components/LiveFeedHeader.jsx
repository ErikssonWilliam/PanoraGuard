import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import closeIcon from "../assets/close-icon.png";

const LiveFeedHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    const id = location.state?.id;
    if (id) {
      navigate("/alert-details", { state: { id } }); // Navigera tillbaka med `id` som state
    } else {
      navigate("/alert-details"); // Om `id` saknas, navigera tillbaka till huvudlistan
    }
  };

  return (
    <div className="relative flex items-center justify-end p-4 bg-[#F5F7FA]">
      <button onClick={handleGoBack} className="absolute top-4 right-4">
        <img src={closeIcon} alt="Close icon" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default LiveFeedHeader;
