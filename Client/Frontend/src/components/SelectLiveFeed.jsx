import { useState, useEffect } from "react";
import { externalURL, lanURL } from "../api/axiosConfig";
import axios from "axios";
import { useAuthStore } from "../utils/useAuthStore";

const SelectLiveFeed = () => {
  const [cameras, setCameras] = useState([]); // State to store cameras
  const [selectedCameraID, setSelectedCameraID] = useState(""); // Track selected camera
  const { token } = useAuthStore();

  useEffect(() => {
    // Fetch the list of cameras to get their locations
    const fetchCameras = async () => {
      try {
        const response = await axios.get(`${externalURL}/cameras/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        const allCameras = data.map((camera) => ({
          id: camera.id,
          location: camera.location,
        }));
        setCameras(allCameras);

        // Set the first camera as the default selection
        if (allCameras.length > 0) {
          setSelectedCameraID(allCameras[0].id);
        }
      } catch (error) {
        console.error("Error fetching camera locations:", error);
      }
    };

    fetchCameras();
  }, [token]);

  const handleCameraChange = (e) => {
    const cameraId = e.target.value;
    setSelectedCameraID(cameraId);
  };

  return (
    <div className="bg-custom-bg min-h-screen flex flex-col items-center -mt-6">
      {/* Dropdown Section */}
      <div className="w-full max-w-md p-12">
        <h3 className="text-2xl font-semibold mb-4 text-[#2E5984] text-center">
          Select Camera
        </h3>
        <label
          htmlFor="camera"
          className="block text-gray-700 font-medium text-lg mb-2 text-center"
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

      {/* Livestream Section */}
      <div
        className="relative w-full p-6"
        style={{ height: "70vh", maxWidth: "90%" }}
      >
        <img
          src={`${lanURL}/livestream/${selectedCameraID}`}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default SelectLiveFeed;
