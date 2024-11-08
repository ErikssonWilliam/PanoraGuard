import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AlarmRow from './AlarmRow';

const AlertDetails = () => {
  const [alarms, setAlarms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/alarms/');
        const allAlarms = response.data;

        // Filters to show pending alarms
        const pendingAlarms = allAlarms.filter(alarm => alarm.status === 'pending');
        
        setAlarms(pendingAlarms);
      } catch (err) {
        console.error('Error fetching alarms:', err);
        setError('Failed to load alarms.');
      }
    };

    fetchAlarms();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-8 text-[#2E5984]">
        Alarm Details:
      </h2>
      <div className="space-y-6">
        {Array.isArray(alarms) && alarms.length > 0 ? (
          alarms.map((alarm) => (
            <AlarmRow key={alarm.id} {...alarm} />
          ))
        ) : (
          <p>No pending alarms found.</p>
        )}
      </div>
    </div>
  );
};

export default AlertDetails;
