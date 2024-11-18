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

const data = [
  { time: "Day 1", addressed: 30, ignored: 5 },
  { time: "Day 2", addressed: 25, ignored: 10 },
  { time: "Day 3", addressed: 35, ignored: 2 },
  { time: "Day 4", addressed: 40, ignored: 3 },
  { time: "Day 5", addressed: 45, ignored: 8 },
];

const AlarmResolutionChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="addressed"
          stackId="a"
          fill="#1E3A8A"
        />{" "}
        {/* Dark Blue (bg-sky-900) */}
        <Area
          type="monotone"
          dataKey="ignored"
          stackId="a"
          fill="#E5E7EB"
        />{" "}
        {/* Light Gray (bg-gray-200) */}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AlarmResolutionChart;
