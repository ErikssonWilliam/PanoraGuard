import LiveFeedHeader from "../components/LiveFeedHeader";
import LiveFeed from "../components/LiveFeed";

const LiveFeedPage = () => {
  return (
    <div className="h-screen flex flex-col bg-[#F5F7FA]">
      <LiveFeedHeader />
      <LiveFeed />
    </div>
  );
};

export default LiveFeedPage;
