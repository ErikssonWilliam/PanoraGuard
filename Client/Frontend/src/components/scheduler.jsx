import { useState, useEffect, useMemo } from "react";
import { externalURL } from "../api/axiosConfig";
import axios from "axios";
import { useAuthStore } from "../utils/useAuthStore";
import MessageBox from "./MessageBox";

const Scheduler = ({ cameraId }) => {
  const [schedule, setSchedule] = useState(
    Array.from({ length: 24 }, () => Array(7).fill(false)),
  );

  const [loading, setLoading] = useState(true);
  const { error, token, setError } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState("");
  const days = useMemo(
    () => [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    [],
  );
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!cameraId) return;
      setLoading(true);

      try {
        const response = await axios.get(`${externalURL}/cameras/${cameraId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        if (data.schedule && data.schedule.week) {
          const transformedSchedule = Array.from(
            { length: 24 },
            (_, hourIndex) =>
              days.map((day) => data.schedule.week[day][hourIndex] === 1),
          );
          setSchedule(transformedSchedule);
        } else {
          setSchedule(Array.from({ length: 24 }, () => Array(7).fill(false)));
        }
      } catch (err) {
        console.error(
          "Error fetching schedule:",
          err.response?.data?.error || err.message,
        );
        setError(err.response?.data?.error || "Failed to fetch schedule.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [cameraId, days, setError, token]);

  const toggleCell = (hourIndex, dayIndex) => {
    const newSchedule = [...schedule];
    newSchedule[hourIndex][dayIndex] = !newSchedule[hourIndex][dayIndex];
    setSchedule(newSchedule);
  };

  const toggleDay = (dayIndex) => {
    const allSelected = schedule.every((hour) => hour[dayIndex]); // Check if all hours are selected for the day
    const newSchedule = schedule.map((hour) => {
      const updatedHour = [...hour];
      updatedHour[dayIndex] = !allSelected; // Toggle all hours in the column
      return updatedHour;
    });
    setSchedule(newSchedule);
  };

  const transformScheduleToJSON = () => {
    const weekSchedule = {};
    days.forEach((day, dayIndex) => {
      weekSchedule[day] = schedule.map((hour) => (hour[dayIndex] ? 1 : 0));
    });
    return { week: weekSchedule };
  };

  const updateSchedule = async () => {
    if (!cameraId) {
      setError("No camera selected");
      return;
    }

    const scheduleJSON = {
      schedule: transformScheduleToJSON(),
    };

    console.log("Payload being sent to server:", scheduleJSON);

    try {
      const response = await axios.put(
        `${externalURL}/cameras/${cameraId}/schedule`,
        scheduleJSON,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = response.data;
      console.log(data);

      setSuccessMessage("Schedule updated successfully");
    } catch (error) {
      console.error(
        "Error updating schedule:",
        error.response?.data?.error || error.message,
      );
      setError(error.response?.data?.error || "Error updating schedule");
    }
  };

  if (loading) return <div>Loading schedule...</div>;

  return (
    <div className=" bg-gray-100 min-h-screen">
      <div className="pt-4 flex items-center justify-between">
        <button
          className="w-1/5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg p-2"
          onClick={updateSchedule}
        >
          Update
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-cyan-600"></div>
            <span className="text-sm">Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300"></div>
            <span className="text-sm">Non-active</span>
          </div>
        </div>
        {error && (
          <MessageBox
            message={error}
            onExit={() => {
              setError("");
            }}
          />
        )}
        {successMessage && (
          <MessageBox
            message={successMessage}
            onExit={() => {
              setSuccessMessage("");
            }}
          />
        )}
      </div>
      <div className="overflow-auto mt-4">
        <table className="table-auto text-sm border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-200"></th>
              {days.map((day, dayIndex) => (
                <th
                  key={day}
                  className="border border-gray-300 p-2 bg-gray-200 text-center"
                >
                  <div className="flex flex-col items-center">
                    {day}
                    <button
                      className="mt-2 w-4/5 bg-cyan-800 hover:bg-cyan-900 text-white rounded-sm px-0.5 py-0.5 font-normal"
                      onClick={() => toggleDay(dayIndex)}
                    >
                      Select All
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour, hourIndex) => (
              <tr key={hour}>
                <td className="border border-gray-300 p-2 bg-gray-200 text-center">
                  {hour}
                </td>
                {days.map((_, dayIndex) => (
                  <td
                    key={dayIndex}
                    className={`border border-gray-300 p-2 text-center cursor-pointer ${
                      schedule[hourIndex][dayIndex]
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() => toggleCell(hourIndex, dayIndex)}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Scheduler;
