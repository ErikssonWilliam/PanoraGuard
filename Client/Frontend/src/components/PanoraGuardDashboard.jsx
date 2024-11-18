import Header from "../components/OperatorHeader";
import StatisticsForm from "./StatisticsForm";
import LocationAlarmChart from "./LocationAlarmChart";
import CameraAlarmChart from "./CameraAlarmChart";
import AlarmResolutionChart from "./AlarmResolutionChart";

function PanoraGuardDashboard() {
  return (
    <main className="flex flex-col bg-slate-50 min-h-screen">
      <Header />

      <div className="w-full border-t border-slate-300 mt-3" />

      <div className="w-full max-w-[1224px] mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Section */}
          <div className="flex flex-col w-full lg:w-3/4 bg-white p-6 shadow-lg rounded-lg">
            {/* Statistics Form */}
            <div className="mb-6 flex justify-center">
              <StatisticsForm />
            </div>

            {/* Statistics Section - Total Alerts and Chart */}
            <div className="flex flex-col px-6">
              <h2 className="text-sm text-slate-700 mb-2">Total Alerts</h2>
              <div className="text-3xl font-semibold text-sky-900 mb-4">
                210
              </div>
              <div className="text-sm text-slate-500 mb-5">
                from 1-12 Dec, 2024
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-300 mb-6" />

              {/* Location Alarm Chart */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Location-wise Alarm Breakdown
                </h3>
                <LocationAlarmChart />
              </div>

              {/* Camera Alarm Chart */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Camera-wise Alarm Breakdown
                </h3>
                <CameraAlarmChart />
              </div>

              {/* Alarm Resolution Chart */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Alarm Resolution Over Time
                </h3>
                <AlarmResolutionChart />
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <aside className="flex flex-col w-full lg:w-1/4 bg-white shadow-lg rounded-lg p-6">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Alerts Distribution
              </h3>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default PanoraGuardDashboard;
