import { useState, useEffect } from "react";
import { externalURL, lanURL } from "../api/axiosConfig";

const SelectLiveFeed = () => {
    const [cameras, setCameras] = useState([]); // State to store cameras
    const [selectedCameraID, setSelectedCameraID] = useState(""); // Track selected camera

    useEffect(() => {
        // Fetch the list of cameras to get their locations
        const fetchCameras = async () => {
            try {
                const response = await fetch(`${externalURL}/cameras/`, {
                    method: "GET",
                });
                const data = await response.json();
                console.log(data);
                console.log(data);
                const allCameras = data.map((camera) => ({
                    id: camera.id,
                    location: camera.location,
                }));
                setCameras(allCameras);
                
                // Set the first camera as the default selection
                if (allCameras.length > 0) {
                    setSelectedCameraID(allCameras[0].id);
                    setConfidenceLevel(allCameras[0].condidence_threshold * 100);
                    fetchBrightnessLevel(allCameras[0].id);
                }
            } catch (error) {
                console.error("Error fetching camera locations:", error);
            }
        };
        
        fetchCameras();
    }, []);

    const handleCameraChange = (e) => {
        const cameraId = e.target.value;
        setSelectedCameraID(cameraId);
  };

    return (
    <div className="bg-custom-bg min-h-screen flex flex-col -mt-6">

  <div className="flex-grow flex items-center justify-center p-4">
    {/* Container for Dropdown and Live Feed */}
    <div className="flex flex-wrap md:flex-nowrap gap-6 p-6 w-full max-w-6xl">
      
      {/* Dropdown Section */}
      <div className="w-full max-w-xs">
        <h1 className="text-2xl font-semibold mb-4 text-[#2E5984]">
          Select camera
        </h1>
        <div>
          <label
            htmlFor="location"
            className="block text-gray-700 font-medium text-lg mb-2"
          >
            Camera ID and Location
          </label>
          <select
            id="camera"
            value={selectedCameraID}
            onChange={handleCameraChange}
            className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-NavyBlue focus:outline-none bg-white"
          >
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.id + " - " + camera.location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Livestream Section */}
      <div
        className="relative flex-grow"
        style={{ height: "70vh", maxWidth: "75%" }}
      >
        <img
          src={`${lanURL}/livestream/${selectedCameraID}`}
          alt="Live feed"
          className="w-full h-full object-contain rounded-lg"
        />
      </div>
    </div>
  </div>
</div>

    );
  };  

export default SelectLiveFeed;