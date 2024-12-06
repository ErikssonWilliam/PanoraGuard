const SpeakerConfig = () => {
  return (
    <div className="font-poppings text-sm">
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
            {" "}
            {/**Add more option */}
            <option value=""></option>
          </select>
        </div>

        <div className="col-span-1 flex flex-col">
          <label htmlFor="speaker-number" className="text-blue-600">
            Speaker Number:
          </label>
          <select
            id="speaker-number"
            className="p-2 rounded-lg w-3/4 ring-1 ring-blue-900"
          >
            {" "}
            {/**Add more option */}
            <option value=""></option>
          </select>
        </div>
      </div>

      <div className="pt-14 flex flex-col w-1/2 space-y-10">
        <label htmlFor="confidence-level">Change the volume:</label>
        <input
          type="range"
          id="confidence-level"
          min="0"
          max="100"
          className=" w-3/4"
        />
      </div>
      <div className="pt-14 flex flex-row w-1/2 space-x-14">
        <button className="w-1/4 bg-NavyBlue text-white rounded-lg p-2">
          Update
        </button>
        <button className="w-1/4 text-white rounded-lg p-2 bg-NewRed">
          Deactive Speaker
        </button>
      </div>
    </div>
  );
};

export default SpeakerConfig;
