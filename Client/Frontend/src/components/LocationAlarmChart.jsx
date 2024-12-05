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

const LocationAlarmChart = ({ selectedLocation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error, token, setError } = useAuthStore(null);

  useEffect(() => {
    const fetchAlarmData = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `${externalURL}/alarms/bylocation/${selectedLocation}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include JWT token
            },
          },
        );

        const cameras = {};
        response.data.forEach((alarm) => {
          const camera = alarm.camera_id;
          if (!cameras[camera]) {
            cameras[camera] = { addressed: 0, ignored: 0 };
          }
          if (alarm.status === "RESOLVED") {
            cameras[camera].addressed++;
          } else if (alarm.status === "IGNORED") {
            cameras[camera].ignored++;
          }
        });

        const chartData = Object.keys(cameras).map((camera) => ({
          location: selectedLocation,
          camera,
          addressed: cameras[camera].addressed,
          ignored: cameras[camera].ignored,
        }));

        console.log("Aggregated alarm data:", chartData); // Debugging log
        setData(chartData);
      } catch (error) {
        console.error("Error fetching alarm data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (selectedLocation) {
      fetchAlarmData();
    }
  }, [selectedLocation, setError, token]);

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
        <Bar dataKey="addressed" stackId="a" fill="#1E3A8A" />
        <Bar dataKey="ignored" stackId="a" fill="#E5E7EB" />
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

export default LocationAlarmChart;
