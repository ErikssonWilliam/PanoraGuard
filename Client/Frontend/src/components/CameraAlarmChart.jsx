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

const data = [
  { camera: "Camera 1", addressed: 8, ignored: 2 },
  { camera: "Camera 2", addressed: 5, ignored: 5 },
  { camera: "Camera 3", addressed: 6, ignored: 1 },
];

const CameraAlarmChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="camera" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="addressed" stackId="a" fill="#1E3A8A" />{" "}
        {/* Dark Blue (bg-sky-900) */}
        <Bar dataKey="ignored" stackId="a" fill="#E5E7EB" />{" "}
        {/* Light Gray (bg-gray-200) */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CameraAlarmChart;
