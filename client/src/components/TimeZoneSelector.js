import React, { useState, useEffect } from 'react';

const TimeZoneSelector = ({ userTimeZone, onSave }) => {
  const [timeZone, setTimeZone] = useState(userTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone);

  const timeZones = [
    'UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo', 
    'Australia/Sydney', 'Africa/Cairo' // You can expand this list with all available time zones.
  ];

  const handleSave = () => {
    onSave(timeZone);
  };

  return (
    <div>
      <h3>Select Your Time Zone</h3>
      <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
        {timeZones.map((zone) => (
          <option key={zone} value={zone}>{zone}</option>
        ))}
      </select>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default TimeZoneSelector;
