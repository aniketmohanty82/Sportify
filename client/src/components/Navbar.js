import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link, useNavigate } from 'react-router-dom'; 
import { FaHome, FaTasks, FaChartPie, FaCog, FaSignOutAlt, FaRunning } from 'react-icons/fa';
import '../Navbar.css';
import logo from '../assets/logo-no-background.png';

const Navbar = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState(localStorage.getItem('username') || "Guest"); // State for username

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName'); // Optionally clear username on logout
    navigate('/login');
  };

  const updateUserInfo = () => {
    const storedUsername = localStorage.getItem('userName');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername("Guest");
    }
  };

  useEffect(() => {
    updateUserInfo(); // Initial update
    const intervalId = setInterval(() => {
      updateUserInfo(); // Update username every 10 seconds
    }, 10000); // 10000 milliseconds = 10 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  return (
    <div className="navbar">
      {/* User info */}
      <div className="navbar__top">
        <div className="navbar__user">
          <img src={logo} alt="User" className="navbar__user-pic" />
          <h3 className="navbar__user-name">{username}</h3>
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
        <button onClick={handleLogout} className="navbar__link">
          <FaSignOutAlt className="navbar__icon" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
