import { useState, useEffect } from "react";
import axios from "axios";
import StatisticsForm from "./StatisticsForm";
import CameraAlarmChart from "./CameraAlarmChart";
import AlarmResolutionChart from "./AlarmResolutionChart";
const ManageData = () => {
  const [alertData, setAlertData] = useState({
    alarms: [], // Store all alarms in a single array
  });

  const [filters, setFilters] = useState({
    location: "A-huset", // Example location
    camera: "B8A44F9EEE36", // Example camera ID
    fromDate: "", // User-defined start date
    tillDate: "", // User-defined end date
  });

  const [loading, setLoading] = useState(false); // Track loading state

  // Fetch alarm data whenever filters change (location, camera, fromDate, tillDate)
  useEffect(() => {
    const fetchAlarmData = async () => {
      setLoading(true); // Set loading to true when data fetching starts

      try {
        // Fetch alarm data using a single API with dynamic location and camera
        const response = await axios.get(
          `http://127.0.0.1:5000/alarms/bylocation/${filters.location}/${filters.camera}`,
        );
        console.log("Fetched alarms:", response.data);

        // Store the fetched alarms in the state
        setAlertData({
          alarms: response.data, // Assuming response.data is an array of alarms
        });
      } catch (error) {
        console.error("Error fetching alert data:", error);
        alert(
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
  }, [filters.location, filters.camera, filters.fromDate, filters.tillDate]); // Re-run the effect if any of the filters change

  // Calculate the total number of alarms after filtering by date
  const getTotalAlerts = () => {
    const filteredAlarms = filterAlarms();
    return filteredAlarms.length;
  };

  // Filter alarms by resolution or any other criteria, specifically by date range
  const filterAlarms = () => {
    const { alarms } = alertData;
    const { fromDate, tillDate } = filters;

    if (!alarms || alarms.length === 0) return [];

    // Convert fromDate and tillDate to Date objects for comparison
    const from = fromDate ? new Date(fromDate) : null;
    const till = tillDate ? new Date(tillDate) : null;

    return alarms.filter((alarm) => {
      const alarmDate = new Date(alarm.timestamp); // Assuming timestamp exists in the alarm
      // Check if alarm is within the date range
      return (!from || alarmDate >= from) && (!till || alarmDate <= till);
    });
  };

  const handleFormSubmit = (filters) => {
    setFilters(filters); // Update filters and trigger useEffect to fetch data
  };

  return (
    <div className="p-6 text-sm font-poppings">
      {/** */}
      <div className="w-full max-w-[1224px] mx-auto p-6">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col w-full lg:w-3/4 bg-white p-6 shadow-lg rounded-lg">
            <div className="mb-8">
              <StatisticsForm onSubmit={handleFormSubmit} />
            </div>

            <section className="flex flex-col space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                  Total Alerts
                </h2>
                <div className="text-4xl font-bold text-sky-900 mb-4">
                  {loading ? "Loading..." : getTotalAlerts()}
                </div>
                <div className="text-sm text-slate-500">
                  from {filters.fromDate} to {filters.tillDate}
                </div>
              </div>

              <div className="h-px bg-slate-300 mb-6" />

              <div>
                <h3 className="text-2xl font-semibold text-sky-900 mb-4 border-b-2 border-sky-900 pb-2 tracking-tight">
                  Camera-wise Alarm Breakdown
                </h3>
                <CameraAlarmChart
                  selectedLocation={filters.location}
                  selectedCamera={filters.camera}
                />
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-sky-900 mb-4 border-b-2 border-sky-900 pb-2 tracking-tight">
                  Alarm Resolution Over Time
                </h3>
                <AlarmResolutionChart
                  selectedLocation={filters.location}
                  selectedCamera={filters.camera}
                  fromDate={filters.fromDate}
                  tillDate={filters.tillDate}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageData;
