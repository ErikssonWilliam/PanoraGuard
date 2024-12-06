import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import ProfileDropdown from "./ProfileDropdown"; // Import the new dropdown component

const Header = ({ userInfo, setErrorMessage }) => {
  const navigate = useNavigate();

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
    <header className="relative flex items-center p-4 bg-[#F5F7FA] border-b">
      {/* Centered Logo */}
      <button onClick={navigateToHome}>
        <img
          src={logo}
          alt="PanoraGuard logo"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5"
          onClick={navigateToHome}
        />
      </button>

      {/* Right Icons (Notification and User) */}
      <div className="ml-auto flex space-x-4 relative">
        <Link to="/select-live-feed">
          <HiOutlineVideoCamera className="w-6 h-6 text-gray-800 hover:scale-110 transition-transform duration-200" />
        </Link>
        <ProfileDropdown /> {/* Use the ProfileDropdown component */}
      </div>
    </header>
  );
};

export default Header;
