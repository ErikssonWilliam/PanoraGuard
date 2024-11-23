import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaUserPlus,
  FaVideo,
  FaBell,
  FaDatabase,
} from "react-icons/fa"; // Import modern icons
import CameraConfig from "../components/cameraConfig";
import ManageData from "../components/manageData";
import AddnewUser from "../components/AddUser";
import { Link } from "react-router-dom";
import AlertDetails from "../components/AlertDetails";
import userIcon from "../assets/user-01.png";
import logo from "../assets/logo.png";

const Admin = () => {
  const [selectedComponent, setSelectedComponent] = useState("Camera");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Manage sidebar visibility

  const renderContent = () => {
    switch (selectedComponent) {
      case "AddUser":
        return (
          <div className="p-8">
            <AddnewUser />
          </div>
        );
      case "Camera":
        return (
          <div className="p-8">
            <CameraConfig />
          </div>
        );
      case "OperatorView":
        return (
          <div className="p-8">
            <AlertDetails />
          </div>
        );
      case "ManageData":
        return (
          <div className="p-8">
            <ManageData />
          </div>
        );
      default:
        return <div>Select a component from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen relative bg-gray-100">
      {/* Header with Hamburger Menu */}
      <header className="relative flex items-center p-4 bg-[#F5F7FA] border-b">
        <button
          className="text-2xl"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FaBars />
        </button>
        {/* Centered Logo */}
        <img
          src={logo}
          alt="PanoraGuard logo"
          className="absolute left-1/2 transform -translate-x-1/2 h-5"
        />

        {/* Right Icons (Notification and User) */}
        <div className="ml-auto flex space-x-4">
          <Link to="/profile">
            <img
              src={userIcon}
              alt="User icon"
              className="w-6 h-6 hover:scale-110 transition-transform duration-200"
            />
          </Link>
        </div>
      </header>

      {/* <div className="bg-NavyBlue text-white p-4 flex justify-between items-center shadow-md">

        <a href="/" className="font-poppins text-xl font-semibold">
          panoraGuard
        </a>
        <Link to="/profile">
          <img src={user} alt="userlogo" className="h-8 w-8 rounded-full" />
        </Link>
      </div> */}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-NavyBlue text-white p-6 z-10 transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-lg`}
        style={{ width: "280px" }}
      >
        {/* Close Icon */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold">Navigation</span>
          <button className="text-xl" onClick={() => setIsSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
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
            <span>Add New User</span>
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
              setSelectedComponent("OperatorView");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
              selectedComponent === "OperatorView" ? "bg-gray-700" : ""
            }`}
          >
            <FaBell className="text-lg" />
            <span>Alarm Details</span>
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
            <span>Manage Data</span>
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
    </div>
  );
};

export default Admin;
