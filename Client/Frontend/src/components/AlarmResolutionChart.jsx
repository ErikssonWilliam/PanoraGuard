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
        <Legend
          formatter={(value, entry, index) => {
            // Different colors for Addressed and Ignored
            const color = entry.dataKey === "addressed" ? "#1E3A8A" : "#E5E7EB"; // Dark Blue for Addressed, Light Gray for Ignored
            return (
              <span style={{ color: "black" }}>
                {/* Custom colored square for Addressed or Ignored */}
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    marginRight: "5px",
                    backgroundColor: color, // Set color for the legend
                  }}
                ></span>
                {value}
              </span>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="addressed"
          stackId="a"
          fill="#1E3A8A" // Dark Blue
        />
        <Area
          type="monotone"
          dataKey="ignored"
          stackId="a"
          fill="#E5E7EB" // Light Gray
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AlarmResolutionChart;
