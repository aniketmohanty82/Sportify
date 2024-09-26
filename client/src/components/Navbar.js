// Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaHome, FaTasks, FaChartPie, FaCog, FaSignOutAlt, FaRunning } from 'react-icons/fa';
import '../Navbar.css';

const Navbar = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Optionally, clear other user data or reset state
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="navbar">
      {/* User info */}
      <div className="navbar__top">
        <div className="navbar__user">
          <img src="https://via.placeholder.com/50" alt="User" className="navbar__user-pic" />
          <h3 className="navbar__user-name">Dhruv Dhawan</h3>
        </div>

        {/* Navigation Links */}
        <nav className="navbar__nav">
          <Link to="/" className="navbar__link">
            <FaHome className="navbar__icon" />
            Home
          </Link>
          <Link to="/sports" className="navbar__link">
            <FaRunning className="navbar__icon" />
            Sports
          </Link>
          <Link to="/tasks" className="navbar__link">
            <FaTasks className="navbar__icon" />
            Tasks
          </Link>
          <Link to="/tracker" className="navbar__link">
            <FaChartPie className="navbar__icon" />
            Calorie Tracking
          </Link>
        </nav>
      </div>

      {/* Settings and Logout at the bottom */}
      <div className="navbar__bottom">
        <Link to="/settings" className="navbar__link">
          <FaCog className="navbar__icon" />
          Settings
        </Link>
        <button onClick={handleLogout} className="navbar__link navbar__logout-button">
          <FaSignOutAlt className="navbar__icon" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
