import AlarmRow from "./AlarmRow";

const OldAlarms = ({ oldAlarms, activeAlarmCount }) => {
  const getHeightClass = () => {
    if (activeAlarmCount >= 3) return "h-[50vh] sd:h-[30vh] hd:h-[35vh] fhd:h-[45vh]";
    if (activeAlarmCount === 2) return "h-[65vh] sd:h-[43vh] hd:h-[36vh] fhd:h-[61vh]";
    return "h-[75vh] sd:h-[52vh] hd:h-[47vh] fhd:h-[68vh]";
  };

  return (
    <div className={`rounded-lg border-gray-300 overflow-y-auto p-4 tablet:p-3 sd:p-1 hd:p-5 ${getHeightClass()}`}>
      {Array.isArray(oldAlarms) && oldAlarms.length > 0 ? (
        oldAlarms.map((alarm) => (
          <AlarmRow key={alarm.id} {...alarm} statusStyle={{ backgroundColor: "green", color: "white" }} />
        ))
      ) : (
        <p className="text-gray-500 text-center">No old alarms found.</p>
      )}
    </div>
  );
};

export default OldAlarms;
