import { useState, useEffect } from "react";
import axios from "axios";
import { externalURL } from "../api/axiosConfig";
import { useAuthStore } from "../utils/useAuthStore";

function StatisticsForm({ onSubmit }) {
  const [locations, setLocations] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { token } = useAuthStore();

  // Fetch locations when component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${externalURL}/cameras/locations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ensure the response is an array and contains objects with a 'location' key
        if (Array.isArray(response.data)) {
          setLocations(response.data);
        } else {
          console.error(
            "Expected an array for locations, but got:",
            response.data,
          );
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, [token]);

  // Fetch cameras when a location is selected
  useEffect(() => {
    const fetchCameras = async () => {
      if (selectedLocation) {
        try {
          const response = await axios.get(
            `${externalURL}/cameras/locations/${selectedLocation}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          // Ensure the response is an array and contains camera IDs
          if (Array.isArray(response.data)) {
            setCameras(response.data);

            // Automatically set the first camera as selected if not already selected
            if (response.data.length > 0) {
              setSelectedCamera(response.data[0].id);
            }
          } else {
            console.error(
              "Expected an array for cameras, but got:",
              response.data,
            );
          }
        } catch (error) {
          console.error("Error fetching cameras:", error);
        }
      } else {
        // Clear camera list if no location is selected
        setCameras([]);
        setSelectedCamera(""); // Reset the selected camera
      }
    };

    fetchCameras();
  }, [selectedLocation, token, selectedCamera]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      location: selectedLocation,
      camera: selectedCamera,
      fromDate,
      toDate,
    });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col max-w-full w-[773px] mx-auto px-6 py-6 bg-white shadow-lg rounded-lg"
    >
      {/* First Row - Location and Camera Number */}
      <div className="flex gap-8 text-sm leading-none text-cyan-700 flex-wrap mb-6">
        {/* Location Dropdown */}
        <div className="flex flex-col flex-1">
          <label
            htmlFor="location"
            className="text-sm font-medium text-slate-800 mb-2"
          >
            Location
          </label>
          <div className="flex items-center gap-3 py-3 px-4 w-full bg-white rounded-lg border border-slate-300 shadow-sm">
            <select
              id="location"
              className="w-full bg-transparent border-none focus:outline-none text-slate-900"
              aria-label="Location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="" disabled>
                Select a Location
              </option>
              {locations.map((locationObj, index) => (
                <option key={index} value={locationObj.location}>
                  {locationObj.location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Camera Number Dropdown */}
        <div className="flex flex-col flex-1">
          <label
            htmlFor="cameraNumber"
            className="text-sm font-medium text-slate-800 mb-2"
          >
            Camera Number
          </label>
          <div className="flex items-center gap-3 py-3 px-4 w-full bg-white rounded-lg border border-slate-300 shadow-sm">
            <select
              id="cameraNumber"
              className="w-full bg-transparent border-none focus:outline-none text-slate-900"
              aria-label="Camera Number"
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              disabled={!selectedLocation} // Disable camera dropdown if no location selected
            >
              <option value="" disabled>
                Select a Camera
              </option>
              {cameras.map((cameraObj, index) => (
                <option key={index} value={cameraObj.id}>
                  {cameraObj.id} {/* Render the camera ID */}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Second Row - From and To Dates */}
      <div className="flex gap-8 text-sm leading-none text-cyan-700 flex-wrap mb-6">
        {/* From Date Input */}
        <div className="flex flex-col flex-1">
          <label
            htmlFor="fromDate"
            className="text-sm font-medium text-slate-800 mb-2"
          >
            From
          </label>
          <div className="flex items-center gap-3 py-3 px-4 w-full bg-white rounded-lg border border-slate-300 shadow-sm">
            <input
              type="date"
              id="fromDate"
              className="w-full bg-transparent border-none focus:outline-none text-slate-900"
              aria-label="From Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
        </div>

        {/* To Date Input */}
        <div className="flex flex-col flex-1">
          <label
            htmlFor="toDate"
            className="text-sm font-medium text-slate-800 mb-2"
          >
            To
          </label>
          <div className="flex items-center gap-3 py-3 px-4 w-full bg-white rounded-lg border border-slate-300 shadow-sm">
            <input
              type="date"
              id="toDate"
              className="w-full bg-transparent border-none focus:outline-none text-slate-900"
              aria-label="To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="px-6 py-3 mt-6 text-base font-semibold text-white bg-cyan-700 rounded-lg hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-600"
      >
        See Stats
      </button>
    </form>
  );
}

export default StatisticsForm;
