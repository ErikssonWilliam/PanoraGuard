import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import ProfileDropdown from "./ProfileDropdown";

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
    <header className="fixed top-0 left-0 w-full z-20 flex items-center justify-between p-4 bg-[#F5F7FA] border-b shadow-md">
      {/* Centered Logo */}
      <Link className="h-4">
        <img
          src={logo}
          alt="PanoraGuard logo"
          className="absolute left-1/2 transform -translate-x-1/2 h-5"
          onClick={navigateToHome}
        />
      </Link>

      {/* Right Icons (Notification and User) */}
      <div className="ml-auto flex space-x-4">
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
