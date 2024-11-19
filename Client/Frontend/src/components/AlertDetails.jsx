import { useEffect, useState } from "react";
import axios from "axios";
import AlarmRow from "./AlarmRow";
import { io } from "socket.io-client"; // Import the socket.io-client
import { baseURL } from "../api/axiosConfig";

const AlertDetails = () => {
  const [alarms, setAlarms] = useState([]);
  const [error, setError] = useState("");

  // Initialize socket connection
  useEffect(() => {
    // Connect to the backend socket server
    const socket = io(baseURL);

    // Fetch initial alarms
    const fetchAlarms = async () => {
      try {
        const response = await axios.get(`${baseURL}/alarms/`);
        const allAlarms = response.data;

        // Filters to show pending alarms
        const currentAlarms = allAlarms.filter(
          (alarm) => alarm.status === "PENDING" || alarm.status === "NOTIFIED",
        );
        setAlarms(currentAlarms);
      } catch (err) {
        console.error("Error fetching alarms:", err);
        setError("Failed to load alarms.");
      }
    };

    // Listen for the new_alarm event
    socket.on("new_alarm", (newAlarm) => {
      // Add the new alarm to the existing alarms list
      setAlarms((prevAlarms) => [...prevAlarms, newAlarm]);
    });

    // Call fetchAlarms initially
    fetchAlarms();

    // Cleanup the socket connection on component unmount
    return () => {
      socket.off("new_alarm"); // Unsubscribe from the event when component unmounts
      socket.disconnect(); // Disconnect the socket connection
    };
  }, []); // Empty dependency array to run only on mount

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-8 text-[#2E5984]">
        Alarm Details:
      </h2>
      <div className="space-y-6">
        {Array.isArray(alarms) && alarms.length > 0 ? (
          alarms.map((alarm) => <AlarmRow key={alarm.id} {...alarm} />)
        ) : (
          <p>No pending alarms found.</p>
        )}
      </div>
    </div>
  );
};

export default AlertDetails;
