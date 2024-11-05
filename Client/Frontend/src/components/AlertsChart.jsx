import React from 'react';

function AlertsChart() {
  const chartData = [
    { day: '01', truePositive: 90, falsePositive: 50 },
    { day: '02', truePositive: 0, falsePositive: 50 },
    { day: '03', truePositive: 70, falsePositive: 90 },
    { day: '04', truePositive: 80, falsePositive: 40 },
    { day: '05', truePositive: 60, falsePositive: 80 },
    { day: '06', truePositive: 100, falsePositive: 70 },
    { day: '07', truePositive: 110, falsePositive: 50 },
    { day: '08', truePositive: 90, falsePositive: 50 },
    { day: '09', truePositive: 70, falsePositive: 90 },
    { day: '10', truePositive: 80, falsePositive: 40 },
    { day: '11', truePositive: 60, falsePositive: 80 },
    { day: '12', truePositive: 100, falsePositive: 70 },
  ];

  return (
    <>
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/2b2848b5dc6b0f8e3833af828d1959c0f5a29bcf6c9b7dd2e5b672b3ee07dd15?apiKey=b098bcbfae4a413cac7bdf6cae526d40&" alt="Alerts chart" className="object-contain self-stretch mt-24 ml-7 w-full aspect-[1000] max-w-[881px] max-md:mt-10 max-md:max-w-full" />
      <div className="flex flex-wrap gap-5 justify-between items-start self-stretch mt-2.5 mr-3.5 w-full max-md:mr-2.5 max-md:max-w-full">
        {chartData.map((item) => (
          <div key={item.day} className="flex gap-2 mt-5 text-xs tracking-wide leading-none text-center text-gray-500 whitespace-nowrap">
            <div className="my-auto">{item.day}</div>
            <div className="flex shrink-0 bg-sky-900 h-[90px] w-[11px]" style={{ height: `${item.truePositive}px` }} />
            <div className="flex gap-1 items-start self-end mt-9">
              <div className="flex shrink-0 mt-1 w-2.5 bg-gray-200 h-[50px]" style={{ height: `${item.falsePositive}px` }} />
              <div>{item.day}</div>
            </div>
          </div>
        ))}
      </div>
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/1dcd7324415fb36a8cbc39244a343eff111de0bf6a44e3201c94492696dc2a6a?apiKey=b098bcbfae4a413cac7bdf6cae526d40&" alt="Alerts chart legend" className="object-contain self-stretch ml-7 w-full aspect-[1000] max-w-[881px] max-md:max-w-full" />
      <div className="flex gap-10 mt-5 ml-9 max-w-full text-xs tracking-wide leading-none text-neutral-900 w-[299px] max-md:ml-2.5">
        <div className="flex flex-1 gap-3">
          <div className="flex shrink-0 my-auto bg-indigo-500 rounded-full h-[9px] w-[13px]" />
          <div>True Positive</div>
        </div>
        <div className="flex flex-1 gap-3">
          <div className="flex shrink-0 my-auto rounded-full bg-zinc-300 h-[9px] w-[13px]" />
          <div>False Positive</div>
        </div>
      </div>
    </>
  );
}

export default AlertsChart;