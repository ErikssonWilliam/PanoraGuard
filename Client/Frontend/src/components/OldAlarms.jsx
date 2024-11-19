import AlarmRow from "./AlarmRow";

const OldAlarms = ({ oldAlarms, activeAlarmCount }) => {
  // Dynamically changes scroll height based on number of alarms 
  const getHeightClass = () => {
    if (activeAlarmCount >= 2) {
      return "h-36"; // Height for 2 alarms
    } else if (activeAlarmCount === 1) {
      return "h-56"; // Height for 1 alarms
    } else {
      return "h-60"; // Height for 0 alarms
    }
  };

  return (
    <div className={`space-y-5 overflow-y-auto border-gray-300 pt-4 ${getHeightClass()}`}>
      {Array.isArray(oldAlarms) && oldAlarms.length > 0 ? (
        oldAlarms.map((alarm) => (
          <AlarmRow
            key={alarm.id}
            {...alarm}
            statusStyle={{ backgroundColor: "green", color: "white" }}
          />
        ))
      ) : (
        <p>No old alarms found.</p>
      )}
    </div>
  );
};

export default OldAlarms;
