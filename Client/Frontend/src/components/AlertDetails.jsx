import React from 'react';
import AlarmRow from './AlarmRow';

const AlertDetails = () => {
  const alarms = [
    { id: 1, cameraNumber: 2, location: 'Lorem ipsum', detected: 'Human', isActive: true },
    { id: 2, cameraNumber: 2, location: 'Lorem ipsum', detected: 'Human', time: '06:00 PM', isActive: false },
    { id: 3, cameraNumber: 2, location: 'Lorem ipsum', detected: 'Human', time: '04:00 PM', isActive: false },
    { id: 4, cameraNumber: 2, location: 'Lorem ipsum', detected: 'Human', time: '02:00 PM', isActive: false },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-8 text-[#2E5984]">
        Alarm Details:
      </h2>
      <div className="space-y-6">
        {alarms.map((alarm) => (
          <AlarmRow key={alarm.id} {...alarm} />
        ))}
      </div>
    </div>
  );
};

export default AlertDetails;
