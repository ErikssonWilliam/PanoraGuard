import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import bellIcon from "../assets/bell-01.png";
import userIcon from "../assets/user-01.png";

const Header = ({ userInfo, setErrorMessage }) => {
  const navigate = useNavigate();

  // Function for admin/operator to redirect to their home page by clicking the bell button user's role
  const navigateToRolePage = () => {
    const userRole = localStorage.getItem("userRole");

    switch (userRole) {
      case "ADMIN":
        navigate("/admin");
        break;
      case "OPERATOR":
        navigate("/operator");
        break;
      default:
        console.error("Unknown role, unable to navigate.");
    }
  };

  // Function to navigate based on the user's role
  const navigateToHome = () => {
    switch (userInfo.role.toLowerCase()) {
      case "ADMIN":
        navigate("/admin");
        break;
      case "OPERATOR":
        navigate("/operator");
        break;
      case "MANAGER":
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

      {/* Notification Icon with Role-Based Navigation */}
      <div className="ml-auto flex space-x-4">
        <button onClick={navigateToRolePage}>
          <img
            src={bellIcon}
            alt="Notification icon"
            className="w-6 h-6 hover:scale-110 transition-transform duration-200"
          />
        </button>

        {/* User Profile Icon */}
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
