import { useState, useEffect, useCallback } from "react";
import { externalURL, lanURL } from "../api/axiosConfig"; // Consolidated imports
import Scheduler from "./scheduler";
import axios from "axios";
import { useAuthStore } from "../utils/useAuthStore";
import MessageBox from "./MessageBox";

const CameraConfig = () => {
  const [confidenceLevel, setConfidenceLevel] = useState(50); // Default confidence level
  const [brightnessLevel, setBrightnessLevel] = useState(50); // Default brightness level
  const [cameras, setCameras] = useState([]); // State to store cameras
  const [selectedCameraID, setSelectedCameraID] = useState(""); // Track selected camera
  const [successMessage, setSuccessMessage] = useState("");
  const { error, token, setError } = useAuthStore();

  // Fetch the brightness level of the selected camera
  const fetchBrightnessLevel = useCallback(
    async (cameraId) => {
      try {
        const response = await axios.get(
          `${lanURL}/brightness/get-brightness?camera_id=${cameraId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = response.data;

        if (data.brightness_level) {
          setBrightnessLevel(data.brightness_level);
        }
      } catch (error) {
        setError(error.response?.data?.error || error.message);
        console.error("Error fetching brightness level:", error);
      }
    },
    [setError, token],
  );

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
        console.log(data);
        const allCameras = data.map((camera) => ({
          id: camera.id,
          location: camera.location,
          condidence_threshold: camera.confidence_threshold,
        }));
        setCameras(allCameras);

        // Set the first camera as the default selection
        if (allCameras.length > 0) {
          setSelectedCameraID(allCameras[0].id);
          setConfidenceLevel(allCameras[0].condidence_threshold * 100);
          fetchBrightnessLevel(allCameras[0].id);
        }
      } catch (error) {
        setError(error.response?.data?.error || error.message);
        console.error("Error fetching brightness level:", error);
      }
    };
    fetchCameras();
  }, [fetchBrightnessLevel, setError, token]);

  // Handle updating confidence level for the selected camera
  const updateConfidenceLevel = async () => {
    try {
      const response = await axios.put(
        `${externalURL}/cameras/${selectedCameraID}/confidence`,
        { confidence: confidenceLevel / 100 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;
      console.log("Server response:", data);

      cameras.filter(
        (camera) => camera.id === selectedCameraID,
      )[0].condidence_threshold = confidenceLevel / 100;
      setSuccessMessage("Confidence level updated successfully");
    } catch (error) {
      console.error("Error updating confidence level:", error);
    }
  };

  // Handle updating brightness level for the selected camera
  const updateBrightnessLevel = async () => {
    try {
      const response = await axios.put(
        `${lanURL}/brightness/set-brightness`,
        {
          camera_id: selectedCameraID,
          new_brightness: parseInt(brightnessLevel, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;
      console.log("Server response:", data);

      setSuccessMessage("Brightness level updated successfully");
    } catch (error) {
      setError(error.response?.data?.error || error.message);
      console.error("Error fetching brightness level:", error);
    }
  };

  // Handle camera selection change and fetch corresponding confidence level
  const handleCameraChange = (e) => {
    const cameraId = e.target.value;
    setSelectedCameraID(cameraId);
    setConfidenceLevel(
      cameras.filter((camera) => camera.id === cameraId)[0]
        .condidence_threshold * 100,
    );
    fetchBrightnessLevel(cameraId);
  };

  return (
    <div className="font-poppins bg-gray-300 md:p-6 xs:p-2 rounded-lg shadow-lg max-w-4xl mx-auto mt-10 space-y-8 ">
      <h2 className="md:text-2xl xs:text-xl font-semibold text-center text-NavyBlue">
        Camera Configuration
      </h2>

      {/* Camera Selection */}
      <div className="space-y-4 p-6  border border-gray-300 bg-BG rounded-lg">
        <label
          htmlFor="location"
          className="block text-gray-700 font-medium text-lg"
        >
          Camera ID and Location
        </label>
        <select
          id="location"
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

      {/* Confidence Level */}
      <div className="space-y-4 p-6 border border-gray-300 bg-BG rounded-lg">
        <label
          htmlFor="confidence-level"
          className="block text-gray-700 md:font-medium xs:font-extralight text-lg"
        >
          Confidence Level
        </label>
        <div className="flex items-center ">
          <input
            type="range"
            id="confidence-level"
            min="0"
            max="100"
            value={confidenceLevel}
            onChange={(e) => setConfidenceLevel(e.target.value)}
            className="w-full accent-cyan-700"
          />
          <span className="text-gray-600">{confidenceLevel}%</span>
        </div>
        <button
          className="bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-2 rounded-md transition"
          onClick={updateConfidenceLevel}
        >
          Update Confidence
        </button>
      </div>

      {/* Brightness Level */}
      <div className="space-y-4 p-6 border border-gray-300 bg-BG rounded-lg">
        <label
          htmlFor="brightness-level"
          className="block text-gray-700 font-medium text-lg"
        >
          Brightness Level
        </label>
        <div className="flex items-center">
          <input
            type="range"
            id="brightness-level"
            min="0"
            max="100"
            value={brightnessLevel}
            onChange={(e) => setBrightnessLevel(e.target.value)}
            className="w-full accent-cyan-700"
          />
          <span className="text-gray-600">{brightnessLevel}%</span>
        </div>
        <button
          className="bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-2 rounded-md transition"
          onClick={updateBrightnessLevel}
        >
          Update Brightness
        </button>
      </div>

      {/* Scheduler */}
      <div className="space-y-4 p-6 border border-gray-300 bg-BG rounded-lg">
        <h3 className="text-lg font-medium text-gray-700">Schedule Cameras</h3>
        <Scheduler cameraId={selectedCameraID} />
      </div>
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
  );
};

export default CameraConfig;
