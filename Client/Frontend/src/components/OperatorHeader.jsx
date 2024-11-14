import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import bellIcon from "../assets/bell-01.png";
import userIcon from "../assets/user-01.png";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-[#F5F7FA] border-b">
      <img src={logo} alt="PanoraGuard logo" className="h-5" />
      <div className="flex space-x-4">
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
