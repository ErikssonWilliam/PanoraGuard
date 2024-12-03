import { useEffect, useState } from "react";
import axios from "axios";
import AlarmRow from "./AlarmRow";
import { externalURL } from "../api/axiosConfig";

const ResolvedAlarms = () => {
  const [resolvedAlarms, setResolvedAlarms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResolvedAlarms = async () => {
      try {
        const response = await axios.get(`${externalURL}/alarms`);
        const resolved = response.data
          .filter(
            (alarm) =>
              (alarm.status === "resolved" || alarm.status === "ignored") &&
              alarm.operator_id !== null &&
              alarm.operator_id !== "N/A" &&
              alarm.operator_id !== "714d0fe2-e04f-4bed-af5e-97faa8a9bb6b", // Exclude specific operator ID
          )
          .slice(0, 10); // Limit to the most recent 10 alarms

        setResolvedAlarms(resolved);
      } catch (err) {
        console.error("Error fetching resolved alarms:", err);
        setError("Failed to load resolved alarms.");
      }
    };

    fetchResolvedAlarms();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-h-[300px] overflow-y-auto space-y-4 border-gray-300 border rounded-lg p-4">
      {Array.isArray(resolvedAlarms) && resolvedAlarms.length > 0 ? (
        resolvedAlarms.map((alarm) => <AlarmRow key={alarm.id} {...alarm} />)
      ) : (
        <p>No old alarms found.</p>
      )}
    </div>
  );
};

export default ResolvedAlarms;
