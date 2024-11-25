import LiveFeedHeader from "../components/LiveFeedHeader";
import { useLocation } from "react-router-dom";
import LiveFeed from "../components/LiveFeed";

const LiveFeedPage = () => {
  const location = useLocation();
  const state = location.state;

  // If no state is provided, redirect or show an error
  if (!state || !state.id || !state.camera_id) {
    return (
      <div className="h-screen flex flex-col bg-[#F5F7FA] ">
        <p>Missing navigation state</p>
      </div>
    );
  }
  return (
    <div className="h-screen flex flex-col bg-[#F5F7FA]">
      <LiveFeedHeader />
      <LiveFeed />
    </div>
  );
};

export default LiveFeedPage;
