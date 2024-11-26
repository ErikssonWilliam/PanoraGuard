import { useState, useEffect } from "react";
import { externalURL, lanURL } from "../api/axiosConfig"; // Consolidated imports
import Scheduler from "./scheduler";

const CameraConfig = () => {
  const [confidenceLevel, setConfidenceLevel] = useState(50); // Default confidence level
  const [brightnessLevel, setBrightnessLevel] = useState(50); // Default brightness level
  const [cameras, setCameras] = useState([]); // State to store cameras
  const [selectedCameraID, setSelectedCameraID] = useState(""); // Track selected camera

  // Fetch the confidence threshold for the selected camera
  // // const fetchConfidenceThreshold = async (cameraId) => {
  // //   try {
  // //     const response = await fetch(
  // //       `${externalURL}/cameras/${cameraId}/confidence`,
  // //     );
  // //     const data = await response.json();

  //     if (data.confidence_threshold) {
  //       setConfidenceLevel(data.confidence_threshold * 100);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching confidence threshold:", error);
  //   }
  // };
  //     if (data.confidence_threshold) {
  //       setConfidenceLevel(data.confidence_threshold * 100);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching confidence threshold:", error);
  //   }
  // };

  // Fetch the brightness level of the selected camera
  const fetchBrightnessLevel = async (cameraId) => {
    try {
      const response = await fetch(
        `${lanURL}/brightness/get-brightness?camera_id=${cameraId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      const data = await response.json();

      if (data.brightness_level) {
        setBrightnessLevel(data.brightness_level);
      }
    } catch (error) {
      console.error("Error fetching brightness level:", error);
    }
  };

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
        console.error("Error fetching camera locations:", error);
      }
    };

    fetchCameras();
  }, []);

  // Handle updating confidence level for the selected camera
  const updateConfidenceLevel = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${externalURL}/cameras/${selectedCameraID}/confidence`,
        `${externalURL}/cameras/${selectedCameraID}/confidence`,
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
      cameras.filter(
        (camera) => camera.id === selectedCameraID,
      )[0].condidence_threshold = confidenceLevel / 100;
      alert("Confidence level updated successfully");
    } catch (error) {
      console.error("Error updating confidence level:", error);
    }
  };

  // Handle updating brightness level for the selected camera
  const updateBrightnessLevel = async () => {
    try {
      const response = await fetch(`${lanURL}/brightness/set-brightness`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          camera_id: selectedCameraID,
          new_brightness: parseInt(brightnessLevel, 10),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update brightness level");
      }

      alert("Brightness level updated successfully");
    } catch (error) {
      console.error("Error updating brightness level:", error);
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
    <div className="font-poppins bg-gray-300 p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-10 space-y-8">
      <h2 className="text-2xl font-semibold text-center text-NavyBlue">
        Camera Configuration
      </h2>

      {/* Camera Selection */}
      <div className="space-y-4 p-6 border border-gray-300 bg-BG rounded-lg">
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
          className="block text-gray-700 font-medium text-lg"
        >
          Confidence Level
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            id="confidence-level"
            min="0"
            max="100"
            value={confidenceLevel}
            onChange={(e) => setConfidenceLevel(e.target.value)}
            className="w-full"
          />
          <span className="text-gray-600">{confidenceLevel}%</span>
        </div>
        <button
          className="bg-NavyBlue text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
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
        <div className="flex items-center space-x-4">
          <input
            type="range"
            id="brightness-level"
            min="0"
            max="100"
            value={brightnessLevel}
            onChange={(e) => setBrightnessLevel(e.target.value)}
            className="w-full"
          />
          <span className="text-gray-600">{brightnessLevel}%</span>
        </div>
        <button
          className="bg-NavyBlue text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={updateBrightnessLevel}
        >
          Update Brightness
        </button>
      </div>

      {/* Scheduler */}
      <div className="space-y-4 p-6 border border-gray-300 bg-BG rounded-lg">
        <h3 className="text-lg font-medium text-gray-700">Schedule Cameras</h3>
        <Scheduler cameraId={selectedCameraID} />
        <Scheduler cameraId={selectedCameraID} />
      </div>
    </div>
  );
};

export default CameraConfig;
