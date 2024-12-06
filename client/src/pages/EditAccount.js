// src/pages/EditAccount.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../EditAccount.css'; // Import the CSS file

const EditAccount = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    timezone: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Fetch current user data
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5001/users/${userId}`, {
          headers: {
            'x-auth-token': token,
          },
        });
        setUserData(res.data);
      } catch (err) {
        console.error(err);
        if (err.response.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchUserData();
  }, [navigate, userId]);

  const validate = () => {
    const newErrors = {};
    if (!userData.firstName) newErrors.firstName = 'First name is required';
    if (!userData.lastName) newErrors.lastName = 'Last name is required';
    if (!userData.username) newErrors.username = 'Username is required';
    if (!userData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    navigate('/settings'); // Assuming the profile page is '/settings'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5001/users/update/${userId}`,
        userData,
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      setMessage('Account updated successfully');
      localStorage.setItem('userName', res.data.user.username);
      navigate('/settings');
    } catch (err) {
      console.error(err);
      if (err.response.status === 400) {
        setErrors({ submit: err.response.data.message });
      } else {
        setErrors({ submit: 'An error occurred. Please try again.' });
      }
    }
  };

  return (
    <div className="edit-account-container">
      <h2>Edit Account Information</h2>
      {message && <p className="success-message">{message}</p>}
      {errors.submit && <p className="error-message">{errors.submit}</p>}
      <form onSubmit={handleSubmit} className="edit-account-form">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <p className="error-message">{errors.firstName}</p>
          )}
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <p className="error-message">{errors.lastName}</p>
          )}
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <p className="error-message">{errors.username}</p>
          )}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="error-message">{errors.email}</p>
          )}
        </div>

        <div className="form-buttons">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAccount;
