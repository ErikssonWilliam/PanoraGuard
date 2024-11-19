import { useState } from "react";

const Scheduler = () => {
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

  // Create initial state for toggled cells
  // Need to be connected with database then initialization could be updated from the database
  const [schedule, setSchedule] = useState(
    Array.from({ length: 24 }, () => Array(7).fill(false)),
  );

  // Toggle cell state
  const toggleCell = (hourIndex, dayIndex) => {
    const newSchedule = [...schedule];
    newSchedule[hourIndex][dayIndex] = !newSchedule[hourIndex][dayIndex];
    setSchedule(newSchedule);
  };

  return (
    <div className="pt-4 bg-gray-100 min-h-screen">
      <div className="overflow-auto">
        <table className="table-auto text-sm border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              {/* Empty corner cell */}
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
                {/* Day column */}
                <td className="border border-gray-300 p-2 bg-gray-200 text-center">
                  {hour}
                </td>
                {/* Hour columns */}
                {days.map((_, dayIndex) => (
                  <td
                    key={hourIndex}
                    className={`border border-gray-300 p-2 text-center cursor-pointer ${
                      schedule[hourIndex][dayIndex]
                        ? "bg-green-600 text-white"
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
        <button className="w-1/5 bg-NavyBlue text-white rounded-lg p-2">
          Update
        </button>
      </div>
    </div>
  );
};

export default Scheduler;
