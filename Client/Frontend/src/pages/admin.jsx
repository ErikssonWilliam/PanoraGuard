import React, { useState } from 'react';
import CameraConfig from '../components/cameraConfig';
import ManageData from '../components/manageData';
import SpeakerConfig from '../components/speakerConfig';

const Admin = () => {
  // Step 1: Set up state to manage selected component
  const [selectedComponent, setSelectedComponent] = useState('Comp1');

  // Step 2: Create a function to render the content based on the selected component
  const renderContent = () => {
    switch (selectedComponent) {
      case 'Camera':
        return (
          <div>
            < CameraConfig />
          </div>
        );
      case 'Speaker':
        return (
          <div>
            < SpeakerConfig />
          </div>
        );
      case 'ManageData':
        return (
          <div>
            < ManageData />
          </div>
        );
      default:
        return <div>Select a component from the sidebar</div>;
    }
  };

  return (
    <div className='grid grid-cols-6 min-h-screen' >

      <div className="col-span-1 bg-NavyBlue text-center">
        {/* Step 3: Sidebar with click handlers to update the state */}
        <div className=" text-white">
            <div className="">
                <a href="#">Panarona</a>
            </div>
          <div className="flex flex-col space-y-16 pt-10">
            <div>
              <a href="#" onClick={() => setSelectedComponent('Camera')}>Camera Configuration</a>
            </div>
            <div>
              <a href="#" onClick={() => setSelectedComponent('Speaker')}>Speaker Configuration</a>
            </div>
            <div>
              <a href="#" onClick={() => setSelectedComponent('ManageData')}>Manage Data</a>
            </div>
          </div>
        </div>
        </div>

        {/* Step 4: Content Area that updates based on the selected component */}
        <div className="col-span-5">
        <div className="text-right">
            <a href="#">img</a>
        </div>
          {renderContent()}
        </div>
      </div>
  );
};

export default Admin;
