import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import bellIcon from "../assets/bell-01.png";
import userIcon from "../assets/user-01.png";

const Header = ({ userInfo, setErrorMessage }) => {
  const navigate = useNavigate();

  // Function to navigate based on the user's role
  const navigateToHome = () => {
    switch (userInfo.role.toLowerCase()) {
      case "admin":
        navigate("/admin");
        break;
      case "operator":
        navigate("/operator");
        break;
      case "manager":
        navigate("/dashboard");
        break;
      default:
        setErrorMessage("Unknown role");
    }
  };

  return (
    <header className="relative flex items-center p-4 bg-[#F5F7FA] border-b -mb-6">
      {/* Centered Logo */}
      <Link>
        <img
          src={logo}
          alt="PanoraGuard logo"
          onClick={navigateToHome}
          className="absolute left-1/2 transform -translate-x-1/2 h-5"
        />
      </Link>

      {/* Right Icons (Notification and User) */}
      <div className="ml-auto flex space-x-4">
        <Link to="/operator">
          <img
            src={bellIcon}
            alt="Notification icon"
            className="w-6 h-6 hover:scale-110 transition-transform duration-200"
          />
        </Link>
        <Link to="/profile">
          <img
            src={userIcon}
            alt="User icon"
            className="w-6 h-6 hover:scale-110 transition-transform duration-200"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
