import AlarmRow from "./AlarmRow";

const ActiveAlarms = ({ alarms }) => {
  // Control height and scroll for more than 3 alarms
  const heightClass = alarms.length >= 3 ? "max-h-[300px] overflow-y-auto" : "";

  return (
<div className={`space-y-4 border-gray-300 border rounded-lg p-4 ${heightClass}`}>
    {Array.isArray(alarms) && alarms.length > 0 ? (
        alarms.map((alarm) => <AlarmRow key={alarm.id} {...alarm} />)
      ) : (
        <p>No active alarms found.</p>
      )}
    </div>
  );
};

export default ActiveAlarms;
