import Header from "../components/OperatorHeader";
//import { isUserLoggedInWithRole } from "../utils/jwtUtils.js";
//import Notification from "../components/Notification.jsx";
import { useState, useEffect } from "react";
import { externalURL, lanURL } from "../api/axiosConfig";

const SelectLiveFeedPage = () => {
    const [cameras, setCameras] = useState([]); // State to store cameras
    const [selectedCameraID, setSelectedCameraID] = useState(""); // Track selected camera

    // Should both OPERATOR and ADMIN be able to access this page?
    /* if (!isUserLoggedInWithRole("OPERATOR")) {
      return (
        <Notification
          message={
            "You do not have access to this page. Please log in with the correct credentials."
          }
        />
      );
    } */

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
        <div className="bg-custom-bg min-h-screen">
        <Header />
      
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-2 text-[#2E5984] pl-4">
            Select camera:
          </h1>
      
          {/* Camera Selection */}
          <div className="p-4 w-fit">
            <label
              htmlFor="location"
              className="block text-gray-700 font-medium text-lg"
            >
              Camera ID and Location
            </label>
            <select
              id="camera"
              value={selectedCameraID}
              onChange={handleCameraChange}
              className="w-full max-w-xs p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-NavyBlue focus:outline-none bg-white"
            >
              {cameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.id + " - " + camera.location}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full max-w-2xl" style={{ height: "65vh" }}>
            <img
            src={`${lanURL}/livestream/${selectedCameraID}`} //Should both operators and admins be able to use this route?
            alt="Live feed"
            className="w-full h-full object-contain rounded-lg"
            />
            </div>

        </div>
      </div>
      
    );
  };  

export default SelectLiveFeedPage;