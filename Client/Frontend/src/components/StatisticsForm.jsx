function StatisticsForm() {
  return (
    <form className="flex flex-col max-w-full w-[773px] mx-auto px-6 py-6 bg-white shadow-lg rounded-lg">
      {/* First Row - Location and Camera Number */}
      <div className="flex gap-8 text-sm leading-none text-cyan-700 flex-wrap mb-6">
        {/* Location Dropdown */}
        <div className="flex flex-col flex-1">
          <label
            htmlFor="location"
            className="text-sm font-medium text-slate-800 mb-2"
          >
            Location
          </label>
          <div className="flex items-center gap-3 py-3 px-4 w-full bg-white rounded-lg border border-slate-300 shadow-sm">
            <select
              id="location"
              className="w-full bg-transparent border-none focus:outline-none text-slate-900"
              aria-label="Location"
            >
              <option value="" disabled selected>
                Select a Location
              </option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={`location-${i + 1}`} value={`Location ${i + 1}`}>
                  Location {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Camera Number Dropdown */}
        <div className="flex flex-col flex-1">
          <label
            htmlFor="cameraNumber"
            className="text-sm font-medium text-slate-800 mb-2"
          >
            Camera Number
          </label>
          <div className="flex items-center gap-3 py-3 px-4 w-full bg-white rounded-lg border border-slate-300 shadow-sm">
            <select
              id="cameraNumber"
              className="w-full bg-transparent border-none focus:outline-none text-slate-900"
              aria-label="Camera Number"
            >
              <option value="" disabled selected>
                Select a Camera
              </option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={`camera-${i + 1}`} value={`Camera ${i + 1}`}>
                  Camera {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Second Row - From and Till Dates */}
      <div className="flex gap-8 text-sm leading-none text-cyan-700 flex-wrap mb-6">
        {/* From Date Input */}
        <div className="flex flex-col flex-1">
          <label
            htmlFor="fromDate"
            className="text-sm font-medium text-slate-800 mb-2"
          >
            From
          </label>
          <div className="flex items-center gap-3 py-3 px-4 w-full bg-white rounded-lg border border-slate-300 shadow-sm">
            <input
              type="date"
              id="fromDate"
              className="w-full bg-transparent border-none focus:outline-none text-slate-900"
              aria-label="From Date"
            />
          </div>
        </div>

        {/* Till Date Input */}
        <div className="flex flex-col flex-1">
          <label
            htmlFor="tillDate"
            className="text-sm font-medium text-slate-800 mb-2"
          >
            Till
          </label>
          <div className="flex items-center gap-3 py-3 px-4 w-full bg-white rounded-lg border border-slate-300 shadow-sm">
            <input
              type="date"
              id="tillDate"
              className="w-full bg-transparent border-none focus:outline-none text-slate-900"
              aria-label="Till Date"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="px-6 py-3 mt-6 text-base font-semibold text-white bg-cyan-700 rounded-lg hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-600"
      >
        See Stats
      </button>
    </form>
  );
}

export default StatisticsForm;
