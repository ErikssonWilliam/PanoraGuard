import { useEffect, useState } from "react";
import axios from "axios";
import { externalURL } from "../api/axiosConfig";

const useFetchAlarms = (
  filterCriteria,
  sortCriteria = (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
) => {
  const [alarms, setAlarms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInitialAlarms = async () => {
      try {
        const response = await axios.get(`${externalURL}/alarms/`);
        const filteredAlarms = response.data
          .filter(filterCriteria)
          .sort(sortCriteria)
          .slice(0, 10);
        setAlarms(filteredAlarms);
      } catch (err) {
        console.error("Error fetching alarms:", err);
        setError("Failed to load alarms.");
      }
    };

    fetchInitialAlarms(); // Runs only on the initial component load.
  }, [filterCriteria, sortCriteria]);

  return { alarms, error };
};

export default useFetchAlarms;
