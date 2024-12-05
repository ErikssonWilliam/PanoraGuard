import { useLocation } from "react-router-dom";
import { lanURL } from "../api/axiosConfig";

const LiveFeed = () => {
  const location = useLocation();

  const camera_id = location.state?.camera_id;

  return (
    <div className="relative flex flex-col items-center justify-center flex-grow p-4">
      {/* Live Feed */}
      <h2 className="text-xl font-semibold mb-2 text-[#2E5984] p-6">
        Live feed of Camera: {camera_id || "Unknown"}
      </h2>
      <div className="relative w-full max-w-2xl" style={{ height: "65vh" }}>
        <img
          src={`${lanURL}/livestream/${camera_id}`}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default LiveFeed;
