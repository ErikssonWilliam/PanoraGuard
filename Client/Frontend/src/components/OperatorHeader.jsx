import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import userIcon from "../assets/user-01.png";
import { HiOutlineVideoCamera } from "react-icons/hi2";

const Header = () => {
  return (
    <header className="relative flex items-center p-4 bg-[#F5F7FA] border-b">
      {/* Centered Logo */}
      <img
        src={logo}
        alt="PanoraGuard logo"
        className="absolute left-1/2 transform -translate-x-1/2 h-5"
      />

      {/* Right Icons (Notification and User) */}
      <div className="ml-auto flex space-x-4">
        <Link to="/select-live-feed">
          <HiOutlineVideoCamera className="w-6 h-6 text-gray-800 hover:scale-110 transition-transform duration-200" />
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
