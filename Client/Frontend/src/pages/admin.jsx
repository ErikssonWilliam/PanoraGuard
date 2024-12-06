import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaUserPlus,
  FaVideo,
  FaBell,
  FaDatabase,
  FaUserEdit, // Add Change User icon
} from "react-icons/fa"; // Import modern icons
import CameraConfig from "../components/cameraConfig";
import ManageData from "../components/manageData";
import AddnewUser from "../components/AddUser";
import { Link } from "react-router-dom";
import AlarmList from "../components/AlarmList.jsx";
import ChangeUser from "../components/ChangeUser"; // Import the ChangeUser component
import logo from "../assets/logo.png";
import { isUserLoggedInWithRole } from "../utils/jwtUtils.js";
import Notification from "../components/Notification.jsx";
import MessageBox from "../components/MessageBox.jsx";
import ProfileDropdown from "../components/ProfileDropdown"; // Import the ProfileDropdown component

const Admin = () => {
  const [selectedComponent, setSelectedComponent] = useState("OperatorView");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Manage sidebar visibility
  const [error, setError] = useState("");

  if (!isUserLoggedInWithRole("ADMIN")) {
    return (
      <Notification
        message={
          "You do not have access to this page. Please log in with the correct credentials."
        }
      />
    );
  }

  const renderContent = () => {
    switch (selectedComponent) {
      case "Camera":
        return (
          <div className="md:p-8 xs:p-4">
            <CameraConfig />
          </div>
        );
      case "ManageData":
        return (
          <div className="md:p-8 xs:p-4">
            <ManageData />
          </div>
        );
      case "OperatorView":
        return (
          <div className="md:p-8 xs:p-4">
            <AlarmList />
          </div>
        );
      case "AddUser":
        return (
          <div className="md:p-8 xs:p-4">
            <AddnewUser />
          </div>
        );
      case "ChangeUser":
        return (
          <div className="md:p-8 xs:p-4">
            <ChangeUser />
          </div>
        );
      default:
        return <div>Select a component from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen relative bg-gray-100">
      <header className="fixed top-0 left-0 w-full z-20 flex items-center justify-between p-4 bg-[#F5F7FA] border-b shadow-md">
        {/* Sidebar Toggle Button */}
        <button
          className="text-2xl w-6 h-6 flex items-center justify-center"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FaBars />
        </button>

        {/* Centered Logo */}
        <div className=" flex justify-center items-center">
          <Link to="/admin">
            <img src={logo} alt="PanoraGuard logo" className="h-5" />
          </Link>
        </div>

        {/* Right Icons */}
        <div className="w-6 flex justify-end">
          {/* Profile Dropdown instead of static user icon */}
          <ProfileDropdown />
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed md:top-0 xs:inset-0 xs:w-full md:w-[280px] left-0 xs:h-auto bg-NavyBlue text-white p-6 z-10 md:transition-transform md:transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-lg`}
      >
        {/* Close Icon */}
        <div className="flex justify-between items-center mb-6">
          {/* <span className="text-lg font-semibold">Navigation</span> */}
          <button
            className="text-xl"
            onClick={() => {
              setIsSidebarOpen(false);
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          <button
            onClick={() => {
              setSelectedComponent("OperatorView");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
              selectedComponent === "OperatorView" ? "bg-gray-700" : ""
            }`}
          >
            <FaBell className="text-lg" />
            <span>Alarms</span>
          </button>
          <button
            onClick={() => {
              setSelectedComponent("Camera");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
              selectedComponent === "Camera" ? "bg-gray-700" : ""
            }`}
          >
            <FaVideo className="text-lg" />
            <span>Camera Configuration</span>
          </button>
          <button
            onClick={() => {
              setSelectedComponent("ManageData");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
              selectedComponent === "ManageData" ? "bg-gray-700" : ""
            }`}
          >
            <FaDatabase className="text-lg" />
            <span>Alarm Statistics</span>
          </button>
          <button
            onClick={() => {
              setSelectedComponent("AddUser");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
              selectedComponent === "AddUser" ? "bg-gray-700" : ""
            }`}
          >
            <FaUserPlus className="text-lg" />
            <span>Add New Users</span>
          </button>
          <button
            onClick={() => {
              setSelectedComponent("ChangeUser");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
              selectedComponent === "ChangeUser" ? "bg-gray-700" : ""
            }`}
          >
            <FaUserEdit className="text-lg" />
            <span>Edit Users</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div
        className={`transition-all duration-300`}
        style={{
          marginLeft: isSidebarOpen ? "280px" : "0",
          padding: "16px",
        }}
      >
        {renderContent()}
      </div>
      {error && (
        <MessageBox
          message={error}
          onExit={() => {
            setError("");
          }}
        />
      )}
    </div>
  );
};

export default Admin;
