import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlarmRow from "./AlarmRow";
import OldAlarms from "./OldAlarms";
import ActiveAlarms from "./ActiveAlarms";
import { io } from "socket.io-client";
import { externalURL } from "../api/axiosConfig";

const AlertDetails = () => {
  const navigate = useNavigate();
  const [activeAlarms, setActiveAlarms] = useState([]);
  const [oldAlarms, setOldAlarms] = useState([]);
  const [error, setError] = useState("");

  const sortByTimestamp = (a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const response = await axios.get(`${externalURL}/alarms/`);
        const allAlarms = response.data;

        // Filter, sort, and set active alarms
        const active = allAlarms
          .filter(
            (alarm) =>
              alarm.status === "PENDING" || alarm.status === "NOTIFIED",
          )
          .sort(sortByTimestamp);
        setActiveAlarms(active);

        // Filter, sort, and set old alarms
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

        // Log results for debugging
        console.log("Active alarms after filtering:", active);
        console.log("Old alarms after filtering:", old);
      } catch (err) {
        console.error("Error fetching alarms:", err);
        setError("Failed to load alarms.");
      }
    };

    fetchAlarms();

    // Socket connection for new alarms
    const socket = io(externalURL);

    ///gustav alinas, a function to start the speaker.
    const startExternalSpeaker = async () => {
      try {
        const speakerResponse = await axios.get(
          `http://127.0.0.1:5100/test/start-speaker`,
        ); //currently hardcode the lan server
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
      setActiveAlarms((prevAlarms) => [...prevAlarms, newAlarm]);
      startExternalSpeaker();
    });

    return () => {
      socket.off("new_alarm");
      socket.disconnect();
    };
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4 flex flex-col space-y-6">
      <div className="ml-10">
        {" "}
        {/* Added ml-10 to push Active Alarms to the right */}
        <h2 className="text-2xl font-semibold mb-4 text-[#2E5984]">
          Active Alarms
        </h2>
        {activeAlarms.length >= 3 ? (
          <ActiveAlarms alarms={activeAlarms} />
        ) : (
          <div className="min-h-[100px] space-y-6 border-b border-gray-300 pb-4">
            {activeAlarms.length > 0 ? (
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
        <div className="ml-10">
          {" "}
          {/* Added ml-10 to push Old Alarms to the right */}
          <h2 className="text-2xl font-semibold mt-1 mb-4 text-[#2E5984]">
            Old Alarms
          </h2>
          {oldAlarms.length > 0 ? (
            <OldAlarms
              oldAlarms={oldAlarms}
              activeAlarmCount={activeAlarms.length}
            />
          ) : (
            <p>No old alarms found.</p>
          )}
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
