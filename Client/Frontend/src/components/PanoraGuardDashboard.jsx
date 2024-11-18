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
            <div className="mb-8">
              <StatisticsForm />
            </div>

            {/* Statistics Section - Total Alerts and Chart */}
            <section className="flex flex-col space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                  Total Alerts
                </h2>
                <div className="text-4xl font-bold text-sky-900 mb-4">210</div>
                <div className="text-sm text-slate-500">
                  from 1-12 Dec, 2024
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-300 mb-6" />

              {/* Location Alarm Chart */}
              <div>
                <h3 className="text-2xl font-semibold text-sky-900 mb-4 border-b-2 border-sky-900 pb-2 tracking-tight">
                  Location-wise Alarm Breakdown
                </h3>
                <LocationAlarmChart />
              </div>

              {/* Camera Alarm Chart */}
              <div>
                <h3 className="text-2xl font-semibold text-sky-900 mb-4 border-b-2 border-sky-900 pb-2 tracking-tight">
                  Camera-wise Alarm Breakdown
                </h3>
                <CameraAlarmChart />
              </div>

              {/* Alarm Resolution Chart */}
              <div>
                <h3 className="text-2xl font-semibold text-sky-900 mb-4 border-b-2 border-sky-900 pb-2 tracking-tight">
                  Alarm Resolution Over Time
                </h3>
                <AlarmResolutionChart />
              </div>
            </section>
          </div>

          {/* Sidebar Section */}
          <aside className="flex flex-col w-full lg:w-1/4 bg-white shadow-lg rounded-lg p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-sky-900 mb-4">
                Alerts Distribution
              </h3>
              {/* Add Alerts Distribution chart or content here */}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default PanoraGuardDashboard;
