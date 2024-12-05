import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { externalURL } from "../api/axiosConfig";
import { useAuthStore } from "../utils/useAuthStore";
import MessageBox from "./MessageBox";

const CameraAlarmChart = ({ selectedLocation, selectedCamera }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error, token, setError } = useAuthStore();

  useEffect(() => {
    // Ensure the location and camera are selected
    if (selectedLocation && selectedCamera) {
      const fetchAlarms = async () => {
        setLoading(true);

        try {
          const response = await axios.get(
            `${externalURL}/alarms/bylocation/${selectedLocation}/${selectedCamera}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Use JWT token for authorization
              },
            },
          );

          const alarms = response.data;
          console.log("Fetched alarms:", alarms); // Log alarms inside the .then block

          // Ensure alarms data is present and process it
          if (alarms && alarms.length > 0) {
            const addressed = alarms.filter(
              (alarm) => alarm.status === "RESOLVED",
            ).length;
            const ignored = alarms.filter(
              (alarm) => alarm.status === "IGNORED",
            ).length;

            // Prepare data for the chart
            const chartData = [{ camera: selectedCamera, addressed, ignored }];

            // Update state with chart data
            setData(chartData);
          } else {
            setData([]);
            setError("No alarms found.");
          }
        } catch (error) {
          console.error("Error fetching alarm data:", error);
          setError("Failed to load data");
        } finally {
          setLoading(false);
        }
      };

      fetchAlarms();
    }
  }, [selectedLocation, selectedCamera, setError, token]); // Dependency on location and camera

  // If loading, show a loading message
  if (loading) return <div>Loading...</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="camera" />
        <YAxis />
        <Tooltip />
        <Legend
          formatter={(value) => <span className="text-black">{value}</span>}
        />
        <Bar dataKey="addressed" stackId="a" fill="#003249" />
        <Bar dataKey="ignored" stackId="a" fill="#007ea7" />
      </BarChart>
      {error && (
        <MessageBox
          message={error}
          onExit={() => {
            setError("");
          }}
        />
      )}
    </ResponsiveContainer>
  );
};

export default CameraAlarmChart;
