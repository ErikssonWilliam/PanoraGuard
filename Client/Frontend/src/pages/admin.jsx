// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import CameraConfig from "../components/cameraConfig";
import ManageData from "../components/manageData";
import SpeakerConfig from "../components/speakerConfig";
import user from "../assets/user.svg";
import AddnewUser from "../components/AddUser";
import { Link } from "react-router-dom";


const Admin = () => {
  // Step 1: Set up state to manage selected component
  const [selectedComponent, setSelectedComponent] = useState("Camera");

  // Step 2: Create a function to render the content based on the selected component
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
      case "Speaker":
        return (
          <div className="p-8">
            <SpeakerConfig />
          </div>
        );
      case "ManageData":
        return (
          <div className="p-12">
            <ManageData />
          </div>
        );
      default:
        return <div>Select a component from the sidebar</div>;
    }
  };

  return (
    <div className="grid grid-cols-6 min-h-screen">
      <div className="col-span-1 bg-NavyBlue text-center">
        {/* Step 3: Sidebar with click handlers to update the state */}
        <div className=" text-white">
          <div className="">
            <a href="/" className="font-poppings text-xl">
              panoraGuard
            </a>
          </div>

          <div className="flex flex-col space-y-16 pt-16">
            <div>
              <button onClick={() => setSelectedComponent("AddUser")}>
                Add New User
              </button>
            </div>
            <div>
              <button onClick={() => setSelectedComponent("Camera")}>
                Camera Configuration
              </button>
            </div>
            <div className='hover:font-bold'>
              <button onClick={() => setSelectedComponent("Speaker")}>
                Speaker Configuration
              </button>
            </div>
            <div className='hover:font-bold'>
              <button onClick={() => setSelectedComponent("ManageData")}>
                Manage Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Content Area that updates based on the selected component */}
      <div className="col-span-5">
        <div className="flex justify-end pr-4">
          <Link to="/profile">
            <img src={user} alt="userlogo" className="text-right" />
          </Link>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;
