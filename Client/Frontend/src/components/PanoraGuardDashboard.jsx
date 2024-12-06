import { useState, useEffect } from "react";
import axios from "axios";
import StatisticsForm from "./StatisticsForm";
import CameraAlarmChart from "./CameraAlarmChart";
import AlarmResolutionChart from "./AlarmResolutionChart";
import Header from "./ManagerHeader";
import { isUserLoggedInWithRole } from "../utils/jwtUtils.js";
import Notification from "./Notification.jsx";
import { externalURL } from "../api/axiosConfig.js";
import CameraAlarmPieChart from "./CameraAlarmPieChart";
import { useAuthStore } from "../utils/useAuthStore.js";
import MessageBox from "./MessageBox.jsx";

function PanoraGuardDashboard() {
  const [alertData, setAlertData] = useState({
    alarms: [], // Store all alarms in a single array
  });

  const [filters, setFilters] = useState({
    location: "", // Example location
    camera: "", // Example camera ID
    fromDate: "", // User-defined start date
    toDate: "", // User-defined end date
  });

  const [showData, setShowData] = useState(false);

  const { token, error, setError } = useAuthStore();
  const [loading, setLoading] = useState(false); // Track loading state

  // Fetch alarm data whenever filters change (location, camera, fromDate, tillDate)
  useEffect(() => {
    const fetchAlarmData = async () => {
      setLoading(true); // Set loading to true when data fetching starts

      try {
        // Fetch alarm data using a single API with dynamic location and camera
        const response = await axios.get(
          `${externalURL}/alarms/bylocation/${filters.location}/${filters.camera}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("Fetched alarms:", response.data);

        // Store the fetched alarms in the state
        setAlertData({
          alarms: response.data, // Assuming response.data is an array of alarms
        });
      } catch (error) {
        console.error("Error fetching alert data:", error);
        setError(
          "There was an error fetching the data. Please check the console for details.",
        );
      } finally {
        setLoading(false); // Set loading to false when data fetching is complete
      }
    };

    // Call the fetch function only when filters are valid
    if (filters.location && filters.camera) {
      fetchAlarmData();
    }
  }, [
    filters.location,
    filters.camera,
    filters.fromDate,
    filters.toDate,
    token,
    setError,
  ]); // Re-run the effect if any of the filters change

  // Calculate the total number of alarms after filtering by date
  const getTotalAlerts = () => {
    const filteredAlarms = filterAlarms();
    return filteredAlarms.length;
  };

  // Filter alarms by resolution or any other criteria, specifically by date range
  const filterAlarms = () => {
    const { alarms } = alertData;
    const { fromDate, toDate } = filters;

    if (!alarms || alarms.length === 0) return [];

    // Convert fromDate and tillDate to Date objects for comparison
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (to) {
      to.setHours(23, 59, 59, 999);
    }

    return alarms.filter((alarm) => {
      const alarmDate = new Date(alarm.timestamp); // Assuming timestamp exists in the alarm
      // Check if alarm is within the date range
      return (!from || alarmDate >= from) && (!to || alarmDate <= to);
    });
  };

  const handleFormSubmit = (filters) => {
    setFilters(filters); // Update filters and trigger useEffect to fetch data
    setShowData(true);
  };
  if (!isUserLoggedInWithRole("MANAGER")) {
    return (
      <Notification
        message={
          "You do not have access to this page. Please log in with the correct credentials."
        }
      />
    );
  }
  return (
    <main className="flex flex-col bg-slate-50 min-h-screen">
      <Header />
      <div className="w-full max-w-[1224px] mx-auto p-6 m-12">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col w-full lg:w-3/4 bg-gray-300 p-6 shadow-lg rounded-lg m-4">
            <div className="mb-8 bg-white shadow-lg rounded-lg p-4">
              <StatisticsForm onSubmit={handleFormSubmit} />
            </div>

            {showData && (
              <section className="flex flex-col space-y-6">
                <div className="text-center bg-white shadow-lg rounded-lg p-4">
                  <h2 className="text-xl font-semibold text-NavyBlue mb-2 uppercase tracking-wide">
                    Total Alerts
                  </h2>
                  <div className="text-4xl font-bold text-NavyBlue mb-4">
                    {loading ? "Loading..." : getTotalAlerts()}
                  </div>
                  {filters.fromDate && filters.toDate && (
                    <div className="text-sm text-NavyBlue">
                      from {filters.fromDate} to {filters.toDate}
                    </div>
                  )}
                </div>
                {/* Title and pie chart: Left-aligned title and centered pie chart */}
                <div className="bg-white shadow-lg rounded-lg p-4">
                  <h3 className="text-2xl font-semibold text-NavyBlue mb-4 border-b-2 border-sky-900 pb-2 tracking-tight">
                    Alarm Distribution by Location
                  </h3>
                  <div className="flex justify-center">
                    <div className="w-4/5 lg:w-2/5">
                      {" "}
                      {/* Adjust the width here as needed */}
                      <CameraAlarmPieChart alarms={alertData.alarms} />
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-4">
                  <h3 className="text-2xl font-semibold text-NavyBlue mb-4 border-b-2 border-sky-900 pb-2 tracking-tight">
                    Alarm Insights by Camera
                  </h3>
                  <CameraAlarmChart
                    selectedLocation={filters.location}
                    selectedCamera={filters.camera}
                  />
                </div>

                <div className="bg-white shadow-lg rounded-lg p-4">
                  <h3 className="text-2xl font-semibold text-NavyBlue mb-4 border-b-2 border-sky-900 pb-2 tracking-tight">
                    Daily Alarm Trends
                  </h3>
                  <AlarmResolutionChart
                    selectedLocation={filters.location}
                    selectedCamera={filters.camera}
                    fromDate={filters.fromDate}
                    toDate={filters.toDate}
                  />
                  {error && (
                    <MessageBox
                      message={error}
                      onExit={() => {
                        setError("");
                      }}
                    />
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default PanoraGuardDashboard;
