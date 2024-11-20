import React, { useState, useEffect } from "react";
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

const LocationAlarmChart = ({ selectedLocation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedLocation) {
      setLoading(true);
      axios
        .get(`http://192.168.0.3:5000/alarms/bylocation/${selectedLocation}`)
        .then((response) => {
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
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching alarm data:", error);
          setError("Failed to load data");
          setLoading(false);
        });
    }
  }, [selectedLocation]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
    </ResponsiveContainer>
  );
};

export default LocationAlarmChart;
