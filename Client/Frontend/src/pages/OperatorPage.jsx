import Header from "../components/OperatorHeader";
import AlertDetails from "../components/AlertDetails";
import { isUserLoggedInWithRole } from "../utils/jwtUtils.js";
import Notification from "../components/Notification.jsx";
const OperatorPage = () => {
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
      <AlertDetails />
    </div>
  );
};

export default OperatorPage;
