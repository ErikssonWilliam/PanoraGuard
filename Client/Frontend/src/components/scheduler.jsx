import { useState, useEffect } from "react";
import { externalURL } from "../api/axiosConfig";

const Scheduler = ({ cameraId }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  // State for the schedule
  const [schedule, setSchedule] = useState(
    Array.from({ length: 24 }, () => Array(7).fill(false)),
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch schedule from the backend
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!cameraId) return; // Avoid fetching if cameraId is not set
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${externalURL}/cameras/${cameraId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch schedule");
        }

        const data = await response.json();

        // Ensure the schedule is properly parsed from the JSON structure
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
        console.error("Error fetching schedule:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [cameraId]);

  // Toggle cell state
  const toggleCell = (hourIndex, dayIndex) => {
    const newSchedule = [...schedule];
    newSchedule[hourIndex][dayIndex] = !newSchedule[hourIndex][dayIndex];
    setSchedule(newSchedule);
  };

  // Transform schedule state into JSON format for the API
  const transformScheduleToJSON = () => {
    const weekSchedule = {};
    days.forEach((day, dayIndex) => {
      weekSchedule[day] = schedule.map((hour) => (hour[dayIndex] ? 1 : 0));
    });
    return { week: weekSchedule };
  };

  // Handle PUT request to update schedule
  const updateSchedule = async () => {
    if (!cameraId) {
      alert("No camera selected");
      return;
    }

    const scheduleJSON = {
      schedule: transformScheduleToJSON(), // Wrap the transformed schedule in "schedule"
    };

    console.log("Payload being sent to server:", scheduleJSON);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${externalURL}/cameras/${cameraId}/schedule`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(scheduleJSON),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update schedule");
      }

      alert("Schedule updated successfully");
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Error updating schedule");
    }
  };

  if (loading) return <div>Loading schedule...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pt-4 bg-gray-100 min-h-screen">
      <div className="overflow-auto">
        <table className="table-auto text-sm border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-200"></th>
              {days.map((day) => (
                <th
                  key={day}
                  className="border border-gray-300 p-2 bg-gray-200 text-center"
                >
                  {day}
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
                        ? "bg-blue-600 text-white"
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
      <div className="pt-4">
        <button
          className="w-1/5 bg-NavyBlue text-white rounded-lg p-2"
          onClick={updateSchedule}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Scheduler;
