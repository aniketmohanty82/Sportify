import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FaHome, FaTasks, FaChartPie, FaCog, FaSignOutAlt, FaRunning } from 'react-icons/fa';
import '../Navbar.css'; // Import your CSS styles

const Navbar = () => {
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
        <Link to="/logout" className="navbar__link">
          <FaSignOutAlt className="navbar__icon" />
          Log out
        </Link>
      </div>
    </div>
  );
};

export default Navbar;