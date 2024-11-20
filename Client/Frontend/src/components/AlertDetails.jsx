import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlarmRow from "./AlarmRow";
import OldAlarms from "./OldAlarms";
import ActiveAlarms from "./ActiveAlarms";
import useFetchAlarms from "./useFetchAlarms";
import { io } from "socket.io-client";
import { externalURL } from "../api/axiosConfig";

const AlertDetails = () => {
  const navigate = useNavigate();
  const [, setAllAlarms] = useState([]);

  // Filter criteria for active alarms
  const activeFilterCriteria = (alarm) =>
    alarm.status === "PENDING" || alarm.status === "NOTIFIED";

  // Filter criteria for old alarms
  const oldFilterCriteria = (alarm) =>
    (alarm.status === "RESOLVED" || alarm.status === "IGNORED") &&
    alarm.operator_id !== null &&
    alarm.operator_id !== "N/A" &&
    alarm.operator_id !== "714d0fe2-e04f-4bed-af5e-97faa8a9bb6b"; // Exclude specific operator ID

  // Use useFetchAlarms hook for active and old alarms
  const { alarms: activeAlarms, error: activeError } =
    useFetchAlarms(activeFilterCriteria);
  const { alarms: oldAlarms, error: oldError } =
    useFetchAlarms(oldFilterCriteria);

  // Update allAlarms state with fetched alarms initially
  useEffect(() => {
    setAllAlarms(activeAlarms);
  }, [activeAlarms]);

  // Initialize socket connection
  useEffect(() => {
    // Connect to the backend socket server
    const socket = io(externalURL);

    // Function to start the external speaker
    const startExternalSpeaker = async () => {
      try {
        const speakerResponse = await axios.get(
          `http://127.0.0.1:5100/test/start-speaker`,
        );
        if (speakerResponse.status === 200) {
          console.log(
            "External speaker triggered successfully:",
            speakerResponse.data,
          );
        } else {
          console.warn(
            "Failed to trigger the external speaker:",
            speakerResponse.data,
          );
        }
      } catch (speakerError) {
        console.error("Error triggering external speaker:", speakerError);
      }
    };

    // Listen for the new_alarm event
    socket.on("new_alarm", (newAlarm) => {
      // Add the new alarm to the existing alarms list
      setAllAlarms((prevAlarms) => [...prevAlarms, newAlarm]);
      startExternalSpeaker();
    });

    // Cleanup the socket connection on component unmount
    return () => {
      socket.off("new_alarm");
      socket.disconnect();
    };
  }, []); // Runs only when mounted

  if (activeError || oldError) {
    return <div>{activeError || oldError}</div>;
  }

  return (
    <div className="p-4 flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[#2E5984]">
          Active Alarms:
        </h2>
        {activeAlarms.length >= 3 ? (
          <ActiveAlarms alarms={activeAlarms} />
        ) : (
          <div className="min-h-[100px] space-y-6 border-b border-gray-300 pb-4">
            {Array.isArray(activeAlarms) && activeAlarms.length > 0 ? (
              activeAlarms.map((alarm) => (
                <AlarmRow key={alarm.id} {...alarm} />
              ))
            ) : (
              <p>No active alarms found.</p>
            )}
          </div>
        )}
      </div>
      {activeAlarms.length <= 2 ? (
        <div>
          <h2 className="text-2xl font-semibold mt-1 mb-4 text-[#2E5984]">
            Old Alarms:
          </h2>
          <OldAlarms
            oldAlarms={oldAlarms}
            activeAlarmCount={activeAlarms.length}
          />
        </div>
      ) : (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate("/old-alarms")}
            className="bg-[#237F94] text-white px-6 py-3 rounded-lg hover:bg-[#1E6D7C] transition duration-200"
          >
            View Old Alarms
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertDetails;
