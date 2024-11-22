import AlarmRow from "./AlarmRow";

const OldAlarms = ({ oldAlarms, activeAlarmCount }) => {
  const getHeightClass = () => {
    if (activeAlarmCount >= 3) return "h-[50vh] sd:h-[37.5vh] hd:h-[45vh] fhd:h-[53.5vh] wuxga:h-[55vh]";
    if (activeAlarmCount === 2) return "h-[55vh] sd:h-[26.5vh] hd:h-[44vh] fhd:h-[60.5vh] wuxga:h-[61.5vh] ";
    if (activeAlarmCount === 1) return "h-[70vh] sd:h-[39vh] hd:h-[55vh] fhd:h-[68vh] wuxga:h-[71.5vh]";
    return "h-[75vh] sd:h-[51vh] hd:h-[56vh] fhd:h-[75.5vh] wuxga:h-[73.5vh]";
  };

  return (
    <div className={`rounded-lg border-gray-300 overflow-y-auto p-4 sd:p-3 hd:p-1 fhd:p-5 wuxga:p-5 ${getHeightClass()}`}>
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
