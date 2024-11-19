const ManageData = () => {
  return (
    <div className="p-6 text-sm font-poppings">
      {/** */}
      <div className="grid grid-cols-2 gap-10">
        <div className="col-span-1 flex flex-col">
          <label htmlFor="location" className="text-blue-600">
            Location:
          </label>
          <select
            id="location"
            className="p-2 rounded-lg w-3/4 ring-1 ring-blue-900"
          >
            <option value="convention-center"></option>
          </select>
        </div>
        <div className="col-span-1 flex flex-col">
          <label htmlFor="camera-number" className="text-blue-600">
            Camera Number:
          </label>
          <select
            id="camera-number"
            className="p-2 rounded-lg w-3/4 ring-1 ring-blue-900"
          >
            <option value="4"></option>
          </select>
        </div>

        <div className="col-span-1 flex flex-col">
          <label htmlFor="fromData">From:</label>
          <input
            type="date"
            value=""
            className="p-2 rounded-lg w-3/4 ring-1 ring-blue-900"
          />
        </div>

        <div className="col-span-1 flex flex-col">
          <label htmlFor="toData">Till:</label>
          <input
            type="date"
            value=""
            className="p-2 rounded-lg w-3/4 ring-1 ring-blue-900"
          />
        </div>
      </div>

      <div className="pt-14 w-1/2">
        <button className="w-1/4 text-white rounded-lg p-2 bg-red-700">
          Clean Data
        </button>
      </div>
    </div>
  );
};

export default ManageData;
