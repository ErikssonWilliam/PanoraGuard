import { useEffect, useState } from "react";
import axios from "axios";
import AlarmRow from "./AlarmRow";
import { externalURL } from "../api/axiosConfig";
import MessageBox from "./MessageBox";

// Fetches the 10 latest "resolved" or "ignored" alarms from the backend
// using pagination and displays them in a scrollable list.
const ResolvedAlarms = () => {
  const [resolvedAlarms, setResolvedAlarms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResolvedAlarms = async () => {
      try {
        const response = await axios.get(
          `${externalURL}/alarms?page=1&per_page=10`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const resolved = response.data.filter(
          (alarm) => alarm.status === "resolved" || alarm.status === "ignored",
        );

        setResolvedAlarms(resolved);
      } catch (err) {
        console.error("Error fetching resolved alarms:", err);
        setError("Failed to load resolved alarms.");
      }
    };

    fetchResolvedAlarms();
  }, []);

  return (
    <div className="max-h-[300px] overflow-y-auto space-y-4 border-gray-300 border rounded-lg p-4">
      {Array.isArray(resolvedAlarms) && resolvedAlarms.length > 0 ? (
        resolvedAlarms.map((alarm) => <AlarmRow key={alarm.id} {...alarm} />)
      ) : (
        <p>No old alarms found.</p>
      )}
      {error && (
        <MessageBox
          message={error}
          onExit={() => {
            setError("");
          }}
        />
      )}
    </div>
  );
};

export default ResolvedAlarms;
