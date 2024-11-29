import Header from "../components/SelectLiveFeedHeader";
import SelectLiveFeed from "../components/SelectLiveFeed.jsx";
import { isUserLoggedInWithRole } from "../utils/jwtUtils.js";
import Notification from "../components/Notification.jsx";

const SelectLiveFeedPage = () => {

    if (!isUserLoggedInWithRole("OPERATOR")) {
      return (
        <Notification
          message={
            "You do not have access to this page. Please log in with the correct credentials."
          }
        />
      );
    }

    return (
      <div className="bg-custom-bg min-h-screen">
      <Header />
      <SelectLiveFeed />
    </div>
    );
  };  

export default SelectLiveFeedPage;