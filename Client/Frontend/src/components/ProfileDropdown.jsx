import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi";
import userIcon from "../assets/user-01.png";
import { useAuthStore } from "../utils/useAuthStore";

const ProfileDropdown = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false); // Manage dropdown visibility
  const { clearAuth } = useAuthStore(); // Access `clearAuth` from the auth store
  const navigate = useNavigate();
  let hideTimeout; // To handle delayed hiding of the dropdown

  const showDropdown = () => {
    clearTimeout(hideTimeout); // Cancel any scheduled hide
    setDropdownVisible(true);
  };

  const hideDropdown = () => {
    hideTimeout = setTimeout(() => {
      setDropdownVisible(false);
    }, 300); // Adjust delay as needed
  };

  const handleLogout = () => {
    clearAuth(); // Clear authentication
    navigate("/"); // Redirect to the homepage after logout
  };

  return (
    <div
      className="relative"
      onMouseEnter={showDropdown}
      onMouseLeave={hideDropdown}
    >
      {/* User Icon */}
      <img
        src={userIcon}
        alt="User icon"
        className="w-6 h-6 hover:scale-110 transition-transform duration-200 cursor-pointer"
      />

      {/* Dropdown Menu */}
      {dropdownVisible && (
        <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-48 z-10 transition-opacity duration-300">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
            onClick={() => setDropdownVisible(false)}
          >
            <FiUser className="mr-2 w-5 h-5 text-gray-600" />
            Profile
          </Link>
          <button
            className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
            onClick={() => {
              setDropdownVisible(false);
              handleLogout(); // Logout logic
            }}
          >
            <FiLogOut className="mr-2 w-5 h-5 text-gray-600" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
