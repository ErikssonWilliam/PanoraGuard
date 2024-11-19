import { useState, useEffect } from "react";
import { baseURL } from "../api/axiosConfig"; // Import baseURL from axiosConfig
import Scheduler from "./scheduler";

const CameraConfig = () => {
  const [confidenceLevel, setConfidenceLevel] = useState(50); // Default confidence level
  const [brightnessLevel, setBrightnessLevel] = useState(50); // Default brightness level
  const [locations, setLocations] = useState([]); // State to store camera locations
  const [selectedLocation, setSelectedLocation] = useState(""); // Track selected location

  // Fetch the confidence threshold for the selected camera
  const fetchConfidenceThreshold = async (cameraId) => {
    try {
      const response = await fetch(`${baseURL}/cameras/${cameraId}/confidence`);
      const data = await response.json();

      if (data.confidence_threshold) {
        setConfidenceLevel(data.confidence_threshold * 100);
      }
    } catch (error) {
      console.error("Error fetching confidence threshold:", error);
    }
  };

  useEffect(() => {
    // Fetch the list of cameras to get their locations
    const fetchCameraLocations = async () => {
      try {
        const response = await fetch(`${baseURL}/cameras`);
        const data = await response.json();

        const cameraLocations = data.map((camera) => ({
          id: camera.id,
          location: camera.location,
        }));
        setLocations(cameraLocations);

        // Set the first camera as the default selection
        if (cameraLocations.length > 0) {
          setSelectedLocation(cameraLocations[0].id);
          fetchConfidenceThreshold(cameraLocations[0].id); // Fetch initial confidence for first camera
        }
      } catch (error) {
        console.error("Error fetching camera locations:", error);
      }
    };

    fetchCameraLocations();
  }, []); // Empty dependency array ensures this runs only once after initial render

  // Handle updating confidence level for the selected camera
  const updateConfidenceLevel = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${baseURL}/cameras/${selectedLocation}/confidence`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            confidence: confidenceLevel / 100,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update confidence level");
      }

      alert("Confidence level updated successfully");
    } catch (error) {
      console.error("Error updating confidence level:", error);
    }
  };

  // Handle updating brightness level for the selected camera
  const updateBrightnessLevel = async () => {
    try {
      const response = await fetch(
        `${baseURL}/cameras/${selectedLocation}/brightness`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brightness: brightnessLevel / 100,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update brightness level");
      }

      alert("Brightness level updated successfully");
    } catch (error) {
      console.error("Error updating brightness level:", error);
    }
  };

  // Handle location selection change and fetch corresponding confidence level
  const handleLocationChange = (e) => {
    const cameraId = e.target.value;
    setSelectedLocation(cameraId);
    fetchConfidenceThreshold(cameraId);
  };

  return (
    <div className="font-poppings text-sm">
      <div className="grid grid-cols-2 gap-8">
        {/* Camera Location Dropdown */}
        <div className="col-span-2 flex flex-col">
          <label htmlFor="location" className="text-blue-600">
            Location:
          </label>
          <select
            id="location"
            value={selectedLocation}
            onChange={handleLocationChange}
            className="p-2 rounded-lg w-3/4 ring-1 ring-blue-900"
          >
            {locations.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.location}
              </option>
            ))}
          </select>
        </div>

        {/* Confidence Level Slider for */}
        <div className="col-span-2 pt-4 flex flex-col space-y-2">
          <label htmlFor="confidence-level">Change the confidence level:</label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              id="confidence-level"
              min="0"
              max="100"
              value={confidenceLevel}
              onChange={(e) => setConfidenceLevel(e.target.value)}
              className="w-3/4"
            />
            <span>{confidenceLevel}%</span>
          </div>
          <button
            className="w-1/5 bg-NavyBlue text-white rounded-lg p-2"
            onClick={updateConfidenceLevel}
          >
            Update
          </button>
        </div>

        {/* Brightness Level Slider */}
        <div className="pt-4 col-span-2 flex flex-col space-y-10">
          <label htmlFor="brightness-level">Change the brightness level:</label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              id="brightness-level"
              min="0"
              max="100"
              value={brightnessLevel}
              onChange={(e) => setBrightnessLevel(e.target.value)}
              className="w-3/4"
            />
            <span>{brightnessLevel}%</span>
          </div>
          <button
            className="w-1/5 bg-NavyBlue text-white rounded-lg p-2"
            onClick={updateBrightnessLevel}
          >
            Update
          </button>
        </div>
      </div>

      {/* Additional schedule-related fields */}
      <div className="grid grid-cols-2 gap-8">
        <h2 className="pt-12 font-bold col-span-2 text-left">
          Schedule Cameras
        </h2>
        {/**Calling scheduling componenets */}
        <div className="col-span-2">
          <Scheduler />
        </div>
      </div>
    </div>
  );
};

export default CameraConfig;
