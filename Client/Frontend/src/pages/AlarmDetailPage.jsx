import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/OperatorHeader";

const AlarmDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [alarm, setAlarm] = useState(null);
  const [liveFootage, setLiveFootage] = useState(""); // State for live footage image
  const [error, setError] = useState("");

  // Gets id from location.state or from URL parameters as fallback
  const id = location.state?.id || sessionStorage.getItem("alarmId");

  useEffect(() => {
    if (!id) {
      setError("Alarm ID is missing.");
      navigate("/alert-details");
      return;
    }

    // Fetch alarm details and image when component mounts
    const fetchAlarmDetails = async () => {
      try {
        console.log("Fetching alarm details...");
        const response = await axios.get(`http://127.0.0.1:5000/alarms/${id}`);
        console.log("Fetched alarm data:", response.data);

        const alarmData = response.data;
        setAlarm({
          id: alarmData.id || alarmData.alarm_id,
          camera_id: alarmData.camera_id || "N/A",
          type: alarmData.type || "N/A",
          confidence_score: alarmData.confidence_score || 0,
          timestamp: alarmData.timestamp || "N/A",
          operator_id: alarmData.operator_id || "N/A",
          status: alarmData.status || "N/A",
        });
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Alarm not found.");
        } else {
          setError("Failed to load alarm details.");
        }
        console.error("Error fetching alarm details:", err);
      }
    };

    const fetchAlarmImage = async () => {
      try {
        const imageResponse = await axios.get(
          `http://127.0.0.1:5000/alarms/${id}/image`,
        );
        if (imageResponse.data && imageResponse.data.image) {
          // Update liveFootage with Base64 image data URL
          setLiveFootage(`data:image/jpeg;base64,${imageResponse.data.image}`);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
        setError("Failed to load alarm image.");
      }
    };

    fetchAlarmDetails();
    fetchAlarmImage();
  }, [id, navigate]);

  const updateAlarmStatus = async (newStatus) => {
    try {
      console.log(`Updating alarm status to ${newStatus}...`);
      const response = await axios.put(
        `http://127.0.0.1:5000/alarms/${id}/status`,
        {
          status: newStatus,
        },
      );
      console.log(`Alarm status updated to ${newStatus}:`, response.data);

      // Merge new status with current alarm object
      setAlarm((prevAlarm) => ({
        ...prevAlarm,
        status: response.data.status, // Updates status
      }));
    } catch (err) {
      console.error(`Error updating alarm status to ${newStatus}:`, err);
      setError(`Failed to update status to ${newStatus}.`);
    }
  };

  return (
    <div className="bg-custom-bg min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="flex w-11/12 justify-between bg-custom-bg max-w-6xl">
          <div className="w-2/5">
            {liveFootage ? (
              <img
                src={liveFootage}
                alt="Live footage"
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <p>Loading live footage...</p>
            )}
          </div>
          <div className="w-2/5 bg-gray-200 rounded-lg p-2 ml-2">
            {alarm ? (
              <>
                <p className="text-xl font-semibold mb-2">
                  Alert number: {alarm.id || "N/A"}
                </p>
                <p className="text-lg">Camera ID: {alarm.camera_id}</p>
                <p className="text-lg">Type: {alarm.type}</p>
                <p className="text-lg">
                  Confidence Level:{" "}
                  {alarm.confidence_score
                    ? (alarm.confidence_score * 100).toFixed(2) + "%"
                    : "N/A"}
                </p>
                <p className="text-lg">
                  Timestamp:{" "}
                  {alarm.timestamp !== "N/A"
                    ? new Date(alarm.timestamp).toLocaleString()
                    : "N/A"}
                </p>
                <p className="text-lg">Operator ID: {alarm.operator_id}</p>
                <p className="text-lg">Status: {alarm.status}</p>
              </>
            ) : (
              <p>Loading alarm details...</p>
            )}
          </div>
        </div>
        <div className="flex justify-between w-10/12 max-w-6xl mt-6">
          <button
            onClick={() => navigate("/live-feed", { state: { id } })}
            className="bg-[#237F94] text-white px-6 py-3 rounded-lg hover:bg-[#1E6D7C] transition duration-200"
          >
            Look at the live feed
          </button>
          <button
            onClick={() => updateAlarmStatus("notified")}
            className="bg-[#237F94] text-white px-6 py-3 rounded-lg hover:bg-[#1E6D7C] transition duration-200"
          >
            Notify the Guard
          </button>
          <button
            onClick={() => updateAlarmStatus("ignored")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Dismiss the alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmDetailPage;
