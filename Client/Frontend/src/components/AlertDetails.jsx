import { useEffect, useState } from "react";
import axios from "axios";
import OldAlarms from "./OldAlarms";
import ActiveAlarms from "./ActiveAlarms";
import { io } from "socket.io-client";
import { externalURL } from "../api/axiosConfig";

const AlertDetails = () => {
  const [activeAlarms, setActiveAlarms] = useState([]);
  const [oldAlarms, setOldAlarms] = useState([]);
  const [error, setError] = useState("");

  const sortByTimestamp = (a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp);

  const sortByStatusAndTimestamp = (a, b) => {
    // Sort notified alarms before active alarms
    if (a.status === "NOTIFIED" && b.status === "PENDING") return -1;
    if (a.status === "PENDING" && b.status === "NOTIFIED") return 1;

    // If status is the same, sort by timestamp (latest first)
    return new Date(b.timestamp) - new Date(a.timestamp);
  };

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const response = await axios.get(`${externalURL}/alarms/`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allAlarms = response.data;

        // Filter, sort, and set active alarms
        const active = allAlarms
          .filter(
            (alarm) =>
              alarm.status === "PENDING" || alarm.status === "NOTIFIED",
          )
          .sort(sortByStatusAndTimestamp);
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
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#2E5984]">
            Active Alarms:
          </h2>
          <ActiveAlarms activeAlarms={activeAlarms} />
        </section>
      </div>

      <div className="ml-10">
        <section>
          <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#2E5984]">
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
