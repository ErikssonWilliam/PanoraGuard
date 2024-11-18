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
  { location: "Location A", addressed: 10, ignored: 5 },
  { location: "Location B", addressed: 7, ignored: 8 },
  { location: "Location C", addressed: 3, ignored: 2 },
];

const LocationAlarmChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="location" />
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

export default LocationAlarmChart;
