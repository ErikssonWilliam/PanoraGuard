import AlarmRow from "./AlarmRow";
import useFetchAlarms from "./useFetchAlarms";

const ResolvedAlarms = () => {
  // Filter criteria for resolved and ignored alarms
  const filterCriteria = (alarm) =>
    (alarm.status === "resolved" || alarm.status === "ignored") &&
    alarm.operator_id !== null &&
    alarm.operator_id !== "N/A" &&
    alarm.operator_id !== "714d0fe2-e04f-4bed-af5e-97faa8a9bb6b"; // Exclude specific operator ID

  // Use useFetchAlarms hook for fetching alarms
  const { alarms: resolvedAlarms, error } = useFetchAlarms(filterCriteria);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-h-[300px] overflow-y-auto space-y-4 border-gray-300 border rounded-lg p-4">
      {Array.isArray(resolvedAlarms) && resolvedAlarms.length > 0 ? (
        resolvedAlarms.map((alarm) => <AlarmRow key={alarm.id} {...alarm} />)
      ) : (
        <p>No old alarms found.</p>
      )}
    </div>
  );
};

export default ResolvedAlarms;
