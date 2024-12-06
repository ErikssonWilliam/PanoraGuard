import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import bellIcon from "../assets/bell-01.png";
import { HiOutlineArrowLeft } from "react-icons/hi";

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
    <header className="fixed top-0 left-0 w-full z-20 flex justify-between items-center p-4 bg-[#F5F7FA] border-b shadow-md">
      {/* Left Spacer */}
      <div className="w-6"></div>

      {/* Centered Logo with Manual Left Shift */}

      <button onClick={navigateToHome}>
        <HiOutlineArrowLeft
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-Black text-2xl cursor-pointer transition-transform duration-200 hover:scale-110"
          title="Go Back"
        />
        <img
          src={logo}
          alt="PanoraGuard logo"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5"
          onClick={navigateToHome}
        />
      </button>

      {/* Right Notification Icon */}
      <div className="ml-auto w-6 flex justify-end">
        <button onClick={navigateToHome}>
          <img
            src={bellIcon}
            alt="Notification icon"
            className="w-6 h-6 hover:scale-110 transition-transform duration-200"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
