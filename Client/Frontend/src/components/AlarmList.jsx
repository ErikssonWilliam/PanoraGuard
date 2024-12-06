import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import OldAlarms from "./OldAlarms";
import ActiveAlarms from "./ActiveAlarms";
import socket from "../utils/socket";
import { externalURL } from "../api/axiosConfig";
import { useAuthStore } from "../utils/useAuthStore";
import MessageBox from "./MessageBox";

const AlarmList = () => {
  const [activeAlarms, setActiveAlarms] = useState([]);
  const [oldAlarms, setOldAlarms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { error, token, setError } = useAuthStore();
  const perPage = 10;

  const sortByTimestamp = useCallback(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    [],
  );

  const sortByStatusAndTimestamp = useCallback((a, b) => {
    if (a.status === "NOTIFIED" && b.status === "PENDING") return -1;
    if (a.status === "PENDING" && b.status === "NOTIFIED") return 1;
    return new Date(b.timestamp) - new Date(a.timestamp);
  }, []);

  const fetchAlarms = useCallback(
    async (page) => {
      try {
        const response = await axios.get(
          `${externalURL}/alarms?page=${page}&per_page=${perPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const allAlarms = response.data;

        // Update alarm if on page 1
        if (page === 1) {
          const active = allAlarms
            .filter(
              (alarm) =>
                alarm.status === "PENDING" || alarm.status === "NOTIFIED",
            )
            .sort(sortByStatusAndTimestamp);
          setActiveAlarms(active);
        }

        // Update old alarms
        const old = allAlarms
          .filter(
            (alarm) =>
              alarm.status === "RESOLVED" || alarm.status === "IGNORED",
          )
          .sort(sortByTimestamp);
        setOldAlarms(old);
      } catch (err) {
        console.error("Error fetching alarms:", err);
        setError("Failed to load alarms.");
      }
    },
    [setError, sortByStatusAndTimestamp, sortByTimestamp, token],
  );

  const fetchTotalAlarmsCount = useCallback(async () => {
    try {
      const response = await axios.get(`${externalURL}/alarms/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const totalAlarms = response.data.total_alarms;
      setTotalPages(Math.ceil(totalAlarms / perPage));
    } catch (err) {
      console.error("Error fetching total alarms count:", err);
      setError("Failed to fetch total alarms count.");
    }
  }, [setError, token]);

  const handleNewAlarm = useCallback((newAlarm) => {
    setActiveAlarms((prevAlarms) => {
      const isDuplicate = prevAlarms.some((alarm) => alarm.id === newAlarm.id);
      return isDuplicate ? prevAlarms : [...prevAlarms, newAlarm];
    });
  }, []);

  useEffect(() => {
    fetchTotalAlarmsCount();
    fetchAlarms(currentPage);

    socket.on("new_alarm", handleNewAlarm);

    return () => {
      socket.off("new_alarm", handleNewAlarm);
    };
  }, [
    fetchAlarms,
    fetchTotalAlarmsCount,
    handleNewAlarm,
    setError,
    currentPage,
  ]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="p-20 flex flex-col space-y-6">
      <section className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold mt-6 mb-4 text-NavyBlue">
          Active Alarms:
        </h2>
        <ActiveAlarms activeAlarms={activeAlarms} />
      </section>

      <section className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold mt-6 mb-4 text-NavyBlue">
          Old Alarms:
        </h2>
        <OldAlarms
          oldAlarms={oldAlarms}
          activeAlarmCount={activeAlarms.length}
        />
      </section>

      <div className="flex justify-center items-center space-x-4 mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md text-white text-lg ${
            currentPage === 1
              ? "bg-gray-400"
              : "bg-[#237F94] hover:bg-[#1E6D7C]"
          }`}
        >
          Previous
        </button>

        {/* Page Count Display */}
        <span className="text-lg text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md text-white text-lg ${
            currentPage === totalPages
              ? "bg-gray-400"
              : "bg-[#237F94] hover:bg-[#1E6D7C]"
          }`}
        >
          Next
        </button>
        {error && (
          <MessageBox
            message={error}
            onExit={() => {
              setError("");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AlarmList;
