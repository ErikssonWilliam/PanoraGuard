import { useState, useEffect } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { externalURL } from "../api/axiosConfig";

const AlarmResolutionChart = ({
  selectedLocation,
  selectedCamera,
  fromDate,
  tillDate,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedLocation && selectedCamera && fromDate && tillDate) {
      const fetchAlarms = async () => {
        setLoading(true);
        setError(null); // Reset error state on each fetch

        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(
            `${externalURL}/alarms/bylocation/${selectedLocation}/${selectedCamera}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const alarms = response.data;
          console.log("Fetched alarms:", alarms);

          // Filter alarms based on the selected date range
          const filteredAlarms = alarms.filter((alarm) => {
            const timestamp = new Date(alarm.timestamp);
            return (
              timestamp >= new Date(fromDate) && timestamp <= new Date(tillDate)
            );
          });

          console.log("Filtered alarms:", filteredAlarms);

          // Create an array of all dates from fromDate to tillDate
          const dateRange = generateDateRange(
            new Date(fromDate),
            new Date(tillDate),
          );

          // Prepare data structure with 0 for resolved and unresolved alarms for each date
          const chartData = dateRange.map((date) => {
            const dateStr = date.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD' format
            const dayAlarms = filteredAlarms.filter(
              (alarm) =>
                new Date(alarm.timestamp).toISOString().split("T")[0] ===
                dateStr,
            );

            const resolved = dayAlarms.filter(
              (alarm) => alarm.status === "RESOLVED",
            ).length;
            const unresolved = dayAlarms.filter(
              (alarm) => alarm.status !== "RESOLVED",
            ).length;

            return { date: dateStr, resolved, unresolved };
          });

          setData(chartData); // Set the prepared data to the state
        } catch (error) {
          console.error("Error fetching alarms:", error);
          setError("Failed to fetch alarms.");
        } finally {
          setLoading(false);
        }
      };

      fetchAlarms();
    }
  }, [selectedLocation, selectedCamera, fromDate, tillDate]);

  // Generate date range between fromDate and tillDate
  const generateDateRange = (startDate, endDate) => {
    let currentDate = startDate;
    const dates = [];
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
    return dates;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="resolved"
          stroke="#155E75" // Dark cyan for resolved
          fill="#155E75"
        />
        <Area
          type="monotone"
          dataKey="unresolved"
          stroke="#38B2AC" // Vibrant cyan for unresolved
          fill="#38B2AC"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AlarmResolutionChart;
