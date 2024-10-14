import React from 'react';

function AlertsDistribution() {
  const distributionData = [
    { time: 'Evening', percentage: 32, color: 'bg-sky-900' },
    { time: 'Afternoon', percentage: 40, color: 'bg-sky-900 bg-opacity-70' },
    { time: 'Morning', percentage: 28, color: 'bg-sky-900 bg-opacity-40' },
  ];

  return (
    <div className="flex flex-col items-start mt-5 text-xs font-medium tracking-wide max-md:mt-8">
      <h2 className="text-sm leading-6 text-black">Alerts raised</h2>
      <a href="#" className="mt-6 leading-5 text-sky-900 bg-blend-normal rotate-[4.976156570067852e-16rad]">
        See individual incidents
      </a>
      <div className="flex flex-col items-center self-stretch pl-11 mt-20 w-full leading-none whitespace-nowrap text-neutral-900 max-md:pl-5 max-md:mt-10">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/7147c162ba6fb81cb1db9fa1603e8282a5f02c234716435cf88b430d8e0e206f?apiKey=b098bcbfae4a413cac7bdf6cae526d40&" alt="Alerts distribution chart" className="object-contain self-end w-36 max-w-full aspect-[0.99]" />
        {distributionData.map((item) => (
          <React.Fragment key={item.time}>
            <div className="flex gap-3 mt-14 ml-6 w-[74px] max-md:mt-10">
              <div className={`flex shrink-0 self-start ${item.color} rounded-full h-[11px] w-[13px]`} />
              <div>{item.time}</div>
            </div>
            <div className="mt-3.5 ml-6">{item.percentage}%</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default AlertsDistribution;