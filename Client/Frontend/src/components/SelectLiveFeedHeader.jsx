import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import userIcon from "../assets/user-01.png";
import { HiOutlineArrowLeft } from "react-icons/hi";

// Function for admin/operator to redirect to their home page by clicking the bell button user's role
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
      <HiOutlineArrowLeft
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-Black text-2xl cursor-pointer transition-transform duration-200 hover:scale-110"
        title="Go Back"
      />
      {/* Centered Logo */}
      <button onClick={navigateToHome}>
        <img
          src={logo}
          alt="PanoraGuard logo"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5"
          onClick={navigateToHome}
        />
      </button>

      {/* Notification Icon with Role-Based Navigation */}
      <div className="ml-auto flex space-x-4">
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
