import { useEffect, useState } from "react";
import profileImage from "../assets/C3WBG.png";
import { externalURL } from "../api/axiosConfig";
import Header from "./ProfileHeader";
import Notification from "./Notification";
import { useAuthStore } from "../utils/useAuthStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MessageBox from "./MessageBox";

// Reusable Loader Component
const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
);

const ProfilePage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { error, userId, token, setError, clearAuth } = useAuthStore();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId || !token) {
        setError("Unauthorized access.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${externalURL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
      } catch (error) {
        setError(error.response?.data?.error || "Failed to fetch user info.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId, token, setError]);

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== repeatPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      await axios.put(
        `${externalURL}/users/${userId}`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuccessMessage("Password changed successfully.");
      setNewPassword("");
      setRepeatPassword("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to change password.",
      );
    }
  };

  // Handle logout
  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  if (!userId || !token) {
    return (
      <Notification message="You are not logged in. Please log in to continue." />
    );
  }

  if (loading) {
    return <Loader />;
  }

  if (!userInfo) {
    return <div>Error: Failed to load user information.</div>;
  }

  return (
    <div className="profilePage w-full h-screen">
      <Header userInfo={userInfo} setErrorMessage={setErrorMessage} />

      {/* Main Content */}
      <div className="mainContent grid lg:grid-cols-5 p-4 pt-10">
        {/* User Info Section */}
        <UserInfoSection userInfo={userInfo} profileImage={profileImage} />
        {/* Change Password Section */}
        <div className="lg:col-span-2 pt-20 xs:row-span-1 bg-BG rounded-lg p-6 mx-10 mt-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <InputField
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
            />
            <InputField
              label="Repeat Password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              type="password"
            />
            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="submitButton mt-4 text-white bg-cyan-700 rounded-lg hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 p-2 w-full mb-4"
            >
              Submit
            </button>
          </form>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="border-2 border-NewRed hover:bg-red-700 hover:text-white text-NewRed font-semibold p-2 rounded-lg shadow-lg transition duration-300 w-full"
          >
            Log Out
          </button>
          {error && (
            <MessageBox
              message={error}
              onExit={() => {
                setError("");
              }}
            />
          )}
          {successMessage && (
            <MessageBox
              message={successMessage}
              onExit={() => {
                setSuccessMessage("");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const UserInfoSection = ({ userInfo, profileImage }) => (
  <div className="lg:col-span-3 flex xs:flex-row bg-white rounded-lg lg:h-[80vh] h-auto">
    <div className="blueSection w-52 bg-NavyBlue p-2 relative rounded-tl-lg rounded-bl-lg  xs:flex-initial">
      <div className="profilePicture w-48 h-48 bg-gray-300 rounded-full overflow-hidden absolute top-1/2 transform -translate-y-1/2">
        <img
          src={profileImage}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
    <div className="whiteSection bg-LightGray flex-1 p-6 rounded-tr-lg rounded-br-lg">
      <h2 className="text-3xl font-bold text-NavyBlue">
        Hello {userInfo.username},
      </h2>
      <div className="mt-24">
        <p className="text-lg text-gray-500">Name: {userInfo.username}</p>
        <p className="text-lg text-gray-500">Role: {userInfo.role}</p>
        <p className="text-lg text-gray-500">Email: {userInfo.email}</p>
      </div>
    </div>
  </div>
);

const InputField = ({ label, value, onChange, type = "text" }) => (
  <div className="mt-4">
    <label className="block text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-4 py-2 border border-[#237F94] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

export default ProfilePage;
