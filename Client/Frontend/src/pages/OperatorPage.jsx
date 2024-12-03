import Header from "../components/OperatorHeader";
import AlarmList from "../components/AlarmList.jsx";
import { isUserLoggedInWithRole } from "../utils/jwtUtils.js";
import Notification from "../components/Notification.jsx";
const OperatorPage = () => {
  if (
    !(isUserLoggedInWithRole("OPERATOR") || isUserLoggedInWithRole("ADMIN"))
  ) {
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
      <AlarmList />
    </div>
  );
};

export default OperatorPage;
