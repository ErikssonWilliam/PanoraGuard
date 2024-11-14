import Header from "./Header";
import StatisticsForm from "./StatisticsForm";
import AlertsChart from "./AlertsChart";
import AlertsDistribution from "./AlertsDistribution";

function PanoraGuardDashboard() {
  return (
    <main className="flex overflow-hidden flex-col pt-2.5 bg-slate-100">
      <Header />
      <div className="mt-2.5 w-full border-slate-300 min-h-[2px] max-md:max-w-full" />
      <div className="w-full max-w-[1224px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-[82%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-wrap grow items-start max-md:mt-3.5">
              <div className="flex flex-col grow shrink-0 my-auto basis-0 w-fit max-md:max-w-full">
                <StatisticsForm />
                <div className="self-start mt-3 ml-14 text-base font-semibold text-center text-white max-md:ml-2.5">
                  Update Stats
                </div>
                <div className="shrink-0 mt-7 h-0 border-slate-300 max-md:max-w-full" />
                <div className="flex flex-col items-start px-8 mt-5 w-full max-md:px-5 max-md:max-w-full">
                  <h2 className="text-sm tracking-wide leading-loose text-black max-md:ml-1">
                    Total alerts
                  </h2>
                  <div className="mt-5 text-xl font-medium tracking-wide leading-snug text-sky-900 max-md:ml-1">
                    210
                  </div>
                  <div className="mt-5 text-sm tracking-wide leading-loose text-black">
                    from 1-12 Dec, 2024
                  </div>
                  <AlertsChart />
                </div>
              </div>
            </div>
          </div>
          <aside className="flex flex-col ml-5 w-[18%] max-md:ml-0 max-md:w-full">
            <AlertsDistribution />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default PanoraGuardDashboard;
