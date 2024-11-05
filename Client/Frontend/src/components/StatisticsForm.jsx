import React from 'react';

function StatisticsForm() {
  return (
    <form className="flex flex-col ml-6 max-w-full w-[773px]">
      <div className="flex flex-wrap gap-10 text-sm leading-none text-cyan-700 max-md:mr-1 max-md:max-w-full">
        <div className="flex flex-col flex-1 grow shrink-0 pb-3 whitespace-nowrap basis-0 w-fit">
          <div className="flex flex-col w-full">
            <label htmlFor="location" className="sr-only">Location</label>
            <div className="flex gap-3 py-3 mt-1 w-full bg-white rounded-lg border border-blue-700 border-solid min-h-[48px]">
              <input type="text" id="location" className="w-full bg-transparent border-none focus:outline-none" aria-label="Location" />
            </div>
          </div>
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/745f4a325798408d80543bbacf1852135593f5c0514bd614a697a7386fbb93c1?apiKey=b098bcbfae4a413cac7bdf6cae526d40&" alt="" className="object-contain z-10 self-end -mt-9 w-6 aspect-square max-md:mr-2.5" />
        </div>
        <div className="flex flex-col flex-1 grow shrink-0 pb-3 basis-0 w-fit">
          <div className="flex flex-col w-full">
            <label htmlFor="cameraNumber" className="sr-only">Camera Number</label>
            <div className="flex gap-3 py-3 mt-1 w-full bg-white rounded-lg border border-blue-700 border-solid min-h-[48px]">
              <input type="text" id="cameraNumber" className="w-full bg-transparent border-none focus:outline-none" aria-label="Camera Number" />
            </div>
          </div>
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/745f4a325798408d80543bbacf1852135593f5c0514bd614a697a7386fbb93c1?apiKey=b098bcbfae4a413cac7bdf6cae526d40&" alt="" className="object-contain z-10 self-end -mt-9 w-6 aspect-square max-md:mr-1.5" />
        </div>
      </div>
      <div className="flex flex-wrap gap-10 mt-6 max-md:max-w-full">
        <div className="flex flex-col flex-1 grow shrink-0 pb-3 basis-0 w-fit">
          <div className="flex flex-col w-full">
            <label htmlFor="fromDate" className="text-sm leading-none text-cyan-700">From</label>
            <input
              type="text"
              id="fromDate"
              className="overflow-hidden flex-1 shrink gap-3 self-stretch px-4 py-3 mt-1 w-full text-base bg-white rounded-lg border border-blue-700 border-solid text-slate-900"
              value="1 / Dec / 2024"
              readOnly
            />
          </div>
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/745f4a325798408d80543bbacf1852135593f5c0514bd614a697a7386fbb93c1?apiKey=b098bcbfae4a413cac7bdf6cae526d40&" alt="" className="object-contain z-10 self-end -mt-9 w-6 aspect-square max-md:mr-2.5" />
        </div>
        <div className="flex flex-col flex-1 grow shrink-0 pb-3 basis-0 w-fit">
          <div className="flex flex-col w-full">
            <label htmlFor="tillDate" className="text-sm leading-none text-cyan-700">Till</label>
            <input
              type="text"
              id="tillDate"
              className="overflow-hidden flex-1 shrink gap-3 self-stretch px-4 py-3 mt-1 w-full text-base bg-white rounded-lg border border-blue-700 border-solid text-slate-900"
              value="12 / Dec / 2024"
              readOnly
            />
          </div>
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/745f4a325798408d80543bbacf1852135593f5c0514bd614a697a7386fbb93c1?apiKey=b098bcbfae4a413cac7bdf6cae526d40&" alt="" className="object-contain z-10 self-end -mt-9 mr-6 w-6 aspect-square max-md:mr-2.5" />
        </div>
      </div>
      <button type="submit" className="overflow-hidden gap-1 self-center px-6 py-4 mt-16 text-base font-semibold text-white bg-cyan-700 rounded-lg max-md:px-5 max-md:mt-10">
        See stats
      </button>
    </form>
  );
}

export default StatisticsForm;