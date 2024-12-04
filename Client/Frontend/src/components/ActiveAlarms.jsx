import AlarmRow from "./AlarmRow";

// Function to determine the height based on number of alarms
const calculateHeightClass = (alarmCount) => {
  if (alarmCount >= 3)
    return "max-h-[36vh] sd:h-[28vh] hd:h-[21vh] fhd:h-[22vh] wuxga:h-[20vh]";
  if (alarmCount === 2)
    return "max-h-[30vh] sd:max-h-[35vh] hd:max-h-[30vh] fhd:max-h-[22vh]";
  return "max-h-auto";
};

// Component to render the active alarms list
const ActiveAlarms = ({ activeAlarms }) => {
  return (
    <div
      className={`overflow-y-auto p-4 sd:p-3 hd:p-1 fhd:p-1 ${calculateHeightClass(
        activeAlarms.length,
      )}`}
    >
      {activeAlarms.length > 0 ? (
        activeAlarms.map((alarm) => <AlarmRow key={alarm.id} alarm={alarm} />)
      ) : (
        <p className="text-gray-500 text-center">No active alarms found.</p>
      )}
    </div>
  );
};

export default ActiveAlarms;
