import React, { useState, useEffect } from 'react';
import TimeZoneSelector from '../components/TimeZoneSelector';

const Settings = () => {
  const [userTimeZone, setUserTimeZone] = useState('');
  const userId = localStorage.getItem('userId'); // Replace this with the actual userId from your authentication or session management

  useEffect(() => {
    // Fetch the user's current time zone from backend when the page loads
    const fetchUserTimeZone = async () => {
      try {
        const response = await fetch(`http://localhost:5001/users/timezone?userId=${userId}`);
        const data = await response.json();
        if (response.ok) {
          setUserTimeZone(data.timezone); // Ensure you use 'timezone' based on the server response
        } else {
          console.error('Failed to fetch user timezone', data.message);
        }
      } catch (error) {
        console.error('Error fetching user timezone:', error);
      }
    };
    fetchUserTimeZone();
  }, [userId]);

  const handleTimeZoneSave = async (timeZone) => {
    try {
      setUserTimeZone(timeZone);
      // Send the updated time zone to the backend
      const response = await fetch('http://localhost:5001/users/update-timezone', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, timezone: timeZone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update timezone', errorData.message);
      }
    } catch (error) {
      console.error('Error updating timezone:', error);
    }
  };

  return (
    <div>
      <h2>Settings Page</h2>
      <TimeZoneSelector userTimeZone={userTimeZone} onSave={handleTimeZoneSave} />
    </div>
  );
};

export default Settings;
