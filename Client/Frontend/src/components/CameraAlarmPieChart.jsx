import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CameraAlarmPieChart = ({ alarms }) => {
  // Example data for the pie chart, using camera_location
  const locationCount = alarms.reduce((acc, alarm) => {
    const location = alarm.camera_location || "Unknown"; // Use camera_location field from alarm data
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  // Data for the pie chart
  const data = {
    labels: Object.keys(locationCount),
    datasets: [
      {
        data: Object.values(locationCount),
        backgroundColor: ["#003249", "#007ea7", "#36A2EB"], // Matching blue colors
        hoverBackgroundColor: ["#003249", "#007ea7", "#36A2EB"], // Matching hover colors
      },
    ],
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      {" "}
      {/* Center the pie chart */}
      <div style={{ width: "80%", height: "300px" }}>
        {" "}
        {/* Chart container with specified width and height */}
        <Pie data={data} />
      </div>
    </div>
  );
};

export default CameraAlarmPieChart;
