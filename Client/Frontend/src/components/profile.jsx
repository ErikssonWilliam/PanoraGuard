import { useEffect, useState } from "react";
import profileImage from "../assets/react.svg";
import bellIcon from "../assets/bell-01.png";
import { Link } from "react-router-dom";
import { baseURL } from "../api/axiosConfig";

const ProfilePage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  // // Fetch auth token from local storage
  // const authToken = localStorage.getItem('authToken');
  const userId = localStorage.getItem("userId");

  // Function to handle password change submission
  const handlePasschangeSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== repeatPassword) {
      setErrorMessage("Passwords do not match!");
      alert("Passwords do not match!");
      return;
    } else if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long!");
      return;
    } else {
      setErrorMessage("");
      try {
        const response = await fetch(`${baseURL}/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        });

        if (response.ok) {
          alert("Password changed successfully!");
        } else {
          throw new Error("Server Error!");
        }
      } catch (error) {
        console.log(error);
        alert("Something went wrong!");
      }
    }
  };

  // Function to fetch user info
  const getUserInfo = async () => {
    const userInfoResponse = await fetch(`${baseURL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await userInfoResponse.json();
    return userInfo;
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getUserInfo();
        setUserInfo(info);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  });

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="profilePage flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <header className="navBar bg-BG text-white p-6 flex justify-between items-center">
        <h1 className="companyName text-3xl font-bold text-ButtonsBlue mx-auto">
          panoraGuard
        </h1>
        <Link
          to="/"
          className="homeButton bg-white text-blue-600 font-semibold py-2 px-4 rounded"
        >
          <img src={bellIcon} alt="Home" className="w-6 h-6" />
        </Link>
      </header>

      {/* Main Content Area */}
      <div className="mainContent flex flex-1 p-4">
        {/* User Information Section */}
        <div className="userInfoSection flex-1 flex bg-white rounded-lg mx-10 mt-4 relative">
          {/* Left Side - Blue Part of User Info */}
          <div className="blueSection w-1/4 bg-NavyBlue p-2 flex flex-col justify-center items-start relative rounded-tl-lg rounded-bl-lg">
            <div className="profilePicture w-48 h-48 bg-gray-300 rounded-full overflow-hidden absolute top-1/2 transform -translate-y-1/2">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Side - White Part of User Info */}
          <div className="whiteSection w-3/4 bg-LightGray p-6 flex flex-col relative rounded-tr-lg rounded-br-lg">
            <div className="greeting absolute top-6 left-6">
              <h2 className="text-3xl font-bold text-blue-600">
                Hello {userInfo.username},
              </h2>
            </div>
            <div className="description flex-1 flex items-start justify-start mt-24">
              <div className="max-w-md w-full">
                <p className="text-lg text-gray-500">
                  Name: {userInfo.username}
                </p>
                <p className="text-lg text-gray-500">Role: {userInfo.role}</p>
                <p className="text-lg text-gray-500">Email: {userInfo.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="changePasswordSection w-1/3 bg-BG rounded-lg p-6 mx-10 mt-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <form onSubmit={handlePasschangeSubmit}>
            <div className="mt-2">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-ButtonsBlue rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new password"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Repeat Password</label>
              <input
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-ButtonsBlue rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Repeat new password"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="submitButton mt-4 bg-blue-600 text-white rounded-lg p-2 w-full"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Log Out Button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            window.location.href = "/";
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
