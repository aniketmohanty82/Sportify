// src/pages/Settings.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Settings.css';

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
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  const navigate = useNavigate();

  // State for controlling the delete confirmation modal
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch the user's profile information and time zone from the backend
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5001/users/${userId}`, {
          headers: {
            'x-auth-token': token, // Include the token in headers
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
  }, [userId, token]);

  const handleTimeZoneSave = async (timeZone) => {
    try {
      setUserTimeZone(timeZone);
      const response = await fetch('http://localhost:5001/users/update-timezone', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Include the token
        },
        body: JSON.stringify({ userId, timezone: timeZone }),
      });

      if (response.ok) {
        setMessage('Time zone updated successfully!');
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

  // Functions to handle the delete account process with a modal
  const handleDeleteAccountClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5001/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Include the token in headers
        },
      });

      if (response.ok) {
        // Clear any user-related data
        localStorage.removeItem('userId');
        localStorage.removeItem('token'); // Remove token as well
        // Redirect to a confirmation page
        navigate('/account-deleted'); // Ensure this route exists
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

  // Available time zones
  const timeZones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney',
    'Africa/Cairo', // Add more as needed
  ];

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Profile Information Section */}
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
            type="button" /* Added to prevent default form submission */
            onClick={() => handleTimeZoneSave(userTimeZone)}
            className="button save-button"
          >
            Save
          </button>
          <button
            type="button" /* Added to prevent default form submission */
            onClick={handleCancel}
            className="button cancel-button"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Edit and Delete Account Buttons */}
      <div className="edit-delete-buttons">
        <button
          type="button" /* Added to prevent default form submission */
          onClick={handleEditAccount}
          className="button edit-account"
        >
          Edit Account
        </button>
        <button
          type="button" /* Added to prevent default form submission */
          onClick={handleDeleteAccountClick}
          className="button delete-account"
        >
          Delete Account
        </button>
      </div>

      {/* Confirmation Modal */}
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
                type="button" /* Added to prevent default form submission */
                onClick={handleConfirmDelete}
                className="button delete-account"
              >
                Yes, Delete
              </button>
              <button
                type="button" /* Added to prevent default form submission */
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