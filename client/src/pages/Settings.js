// src/pages/Settings.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Settings.css';
import axios from 'axios';

const Settings = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    timeZoneUser: '',
  });
  const [userTimeZone, setUserTimeZone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // State for controlling the delete confirmation modal
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch the user's profile information and time zone from the backend
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5001/users/${userId}`, {
          headers: {
            'x-auth-token': token,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUserData({
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            email: data.email,
            timeZoneUser: data.timezone,
          });
          setUserTimeZone(data.timezone);
        } else {
          setError('Failed to fetch user profile information');
        }
      } catch (error) {
        setError('Error fetching user profile');
        console.error(error);
      }
    };
    fetchUserProfile();
    fetchDarkModeSetting()
  }, [userId, token]);

  const fetchDarkModeSetting = async () => {
    try {
      const response = await fetch(`http://localhost:5001/users/darkMode?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Include token if authentication is needed
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dark mode setting');
      }

      const data = await response.json();
      setDarkMode(data.darkMode);
      console.log(darkMode)
    } catch (error) {
      console.error('Error fetching dark mode setting:', error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      // Toggle dark mode locally
      console.log(darkMode)
      const updatedDarkMode = !darkMode; // Toggle from the previous state
      setDarkMode(updatedDarkMode)
      console.log(updatedDarkMode)

      // Save the updated dark mode setting on the server
      fetch(`http://localhost:5001/users/update-darkMode`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Include the token in headers
        }, body: JSON.stringify({ userId, darkMode: updatedDarkMode }),
      });
    } catch (error) {
      console.error('Error updating dark mode:', error);
    }
  };

  const handleTimeZoneSave = async (timeZone) => {
    try {
      setUserTimeZone(timeZone);
      const response = await fetch('http://localhost:5001/users/update-timezone', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ userId, timezone: timeZone }),
      });
  
      if (response.ok) {
        setMessage('Time zone updated successfully!');
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update timezone');
      }
    } catch (error) {
      setError('Error updating timezone');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setMessage('');
    setError('');
  };

  const handleEditAccount = () => {
    navigate('/edit-account');
  };

  const handleDeleteAccountClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5001/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        navigate('/account-deleted');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete account');
        setShowModal(false);
      }
    } catch (error) {
      setError('Error deleting account');
      console.error(error);
      setShowModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const timeZones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney',
    'Africa/Cairo',
  ];

  return (
    <div className={`settings-container ${darkMode ? 'dark-mode' : ''}`}>
      <h2>Account Settings</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="profile-info">
        <h3>Profile Information</h3>
        <div className="profile-item">
          <label>First Name:</label>
          <span>{userData.firstName}</span>
        </div>
        <div className="profile-item">
          <label>Last Name:</label>
          <span>{userData.lastName}</span>
        </div>
        <div className="profile-item">
          <label>Username:</label>
          <span>{userData.username}</span>
        </div>
        <div className="profile-item">
          <label>Email:</label>
          <span>{userData.email}</span>
        </div>
        <div className="profile-item">
          <label>Time Zone:</label>
          <span>{userData.timeZoneUser}</span>
        </div>
      </div>

      {/* Dark Mode Toggle Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button
          onClick={toggleDarkMode}
          className="button toggle-button"
          style={{
            backgroundColor: darkMode ? '#1aa64b' : '#ddd',
            color: darkMode ? '#fff' : '#333',
            border: 'none',
            borderRadius: '5px',
            padding: '10px',
            cursor: 'pointer',
          }}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Time Zone Selector */}
      <div className="timezone-form">
        <h3>Select Your Time Zone</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={userTimeZone}
            onChange={(e) => setUserTimeZone(e.target.value)}
            className="button"
          >
            {timeZones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => handleTimeZoneSave(userTimeZone)}
            className="button save-button"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="button cancel-button"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="edit-delete-buttons">
        <button
          type="button"
          onClick={handleEditAccount}
          className="button edit-account"
        >
          Edit Account
        </button>
        <button
          type="button"
          onClick={handleDeleteAccountClick}
          className="button delete-account"
        >
          Delete Account
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Account Deletion</h3>
            <p>
              Are you sure you want to permanently delete your account? This
              action cannot be undone.
            </p>
            <div className="modal-buttons">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="button delete-account"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="button cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
