import { useNavigate } from "react-router-dom";
import closeIcon from "../assets/close-icon.png";

const LiveFeedHeader = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // If 'id' is missing, navigate back to the main list
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
