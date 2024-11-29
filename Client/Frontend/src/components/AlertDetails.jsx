import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import OldAlarms from "./OldAlarms";
import ActiveAlarms from "./ActiveAlarms";
import socket from "../utils/socket";
import { externalURL, lanURL } from "../api/axiosConfig";

const AlertDetails = () => {
  const [activeAlarms, setActiveAlarms] = useState([]);
  const [oldAlarms, setOldAlarms] = useState([]);
  const [error, setError] = useState("");

  const sortByTimestamp = useCallback(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    [],
  );

  // Sort by status and timestamp
  const sortByStatusAndTimestamp = useCallback((a, b) => {
    if (a.status === "NOTIFIED" && b.status === "PENDING") return -1;
    if (a.status === "PENDING" && b.status === "NOTIFIED") return 1;
    return new Date(b.timestamp) - new Date(a.timestamp);
  }, []);

  // Fetch alarms from the server
  const fetchAlarms = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${externalURL}/alarms/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allAlarms = response.data;

      // Process active alarms
      const active = allAlarms
        .filter(
          (alarm) => alarm.status === "PENDING" || alarm.status === "NOTIFIED",
        )
        .sort(sortByStatusAndTimestamp);
      setActiveAlarms(active);

      // Process old alarms
      const old = allAlarms
        .filter(
          (alarm) =>
            (alarm.status === "RESOLVED" || alarm.status === "IGNORED") &&
            alarm.operator_id !== null &&
            alarm.operator_id !== "N/A" &&
            alarm.operator_id !== "714d0fe2-e04f-4bed-af5e-97faa8a9bb6b",
        )
        .sort(sortByTimestamp)
        .slice(0, 10);
      setOldAlarms(old);

      console.log("Active alarms after filtering:", active);
      console.log("Old alarms after filtering:", old);
    } catch (err) {
      console.error("Error fetching alarms:", err);
      setError("Failed to load alarms.");
    }
  }, [sortByStatusAndTimestamp, sortByTimestamp]);

  // Start external speaker
  const startExternalSpeaker = useCallback(async () => {
    try {
      const response = await axios.get(`${lanURL}/test/start-speaker`);
      if (response.status === 200) {
        console.log("External speaker triggered successfully:", response.data);
      } else {
        console.warn("Failed to trigger the external speaker:", response.data);
      }
    } catch (error) {
      console.error("Error triggering external speaker:", error);
    }
  }, []);

  // Handle new alarms from the socket
  const handleNewAlarm = useCallback(
    (newAlarm) => {
      setActiveAlarms((prevAlarms) => {
        const isDuplicate = prevAlarms.some(
          (alarm) => alarm.id === newAlarm.id,
        );
        return isDuplicate ? prevAlarms : [...prevAlarms, newAlarm];
      });
      startExternalSpeaker();
    },
    [startExternalSpeaker],
  );

  // Initialize the component
  useEffect(() => {
    fetchAlarms();

    // Listen for socket events
    socket.on("new_alarm", handleNewAlarm);

    return () => {
      socket.off("new_alarm", handleNewAlarm);
    };
  }, [fetchAlarms, handleNewAlarm]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4 flex flex-col space-y-6">
      <div className="ml-10">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-NavyBlue">
            Active Alarms:
          </h2>
          <ActiveAlarms activeAlarms={activeAlarms} />
        </section>
      </div>

      <div className="ml-10">
        <section>
          <h2 className="text-2xl font-semibold mt-6 mb-4 text-NavyBlue">
            Old Alarms:
          </h2>
          <OldAlarms
            oldAlarms={oldAlarms}
            activeAlarmCount={activeAlarms.length}
          />
        </section>
      </div>
    </div>
  );
};

export default AlertDetails;
