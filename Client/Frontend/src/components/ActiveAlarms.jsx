import AlarmRow from "./AlarmRow";

const calculateHeightClass = (alarmCount) => {
  if (alarmCount >= 3)
    return "max-h-[31vh] sd:h-[25vh] hd:h-[21vh] fhd:h-[22vh] wuxga:h-[20vh]";
  if (alarmCount === 2)
    return "max-h-[30vh] sd:max-h-[35vh] hd:max-h-[30vh] fhd:max-h-[22vh]";
  return "max-h-auto";
};

const ActiveAlarms = ({ activeAlarms }) => {
  return (
    <div
      className={`overflow-y-auto p-4 sd:p-3 hd:p-1 fhd:p-1 ${calculateHeightClass(
        activeAlarms.length,
      )}`}
    >
      {activeAlarms.length > 0 ? (
        activeAlarms.map((alarm) => <AlarmRow key={alarm.id} id={alarm.id} />)
      ) : (
        <p className="text-gray-500 text-center">No active alarms found.</p>
      )}
    </div>
  );
};

export default ActiveAlarms;
