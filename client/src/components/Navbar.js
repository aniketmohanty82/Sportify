import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link, useNavigate } from 'react-router-dom'; 
import { FaHome, FaTasks, FaChartPie, FaCog, FaSignOutAlt, FaRunning, FaFutbol, FaDumbbell } from 'react-icons/fa';
import { MdOutlineQuiz } from "react-icons/md";
import '../Navbar.css';
import logo from '../assets/logo-no-background.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem('username') || "Guest");

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('timeZone');
    localStorage.removeItem('userId');
    localStorage.removeItem('favoriteSoccerTeam');
    localStorage.removeItem('favoriteSoccerTeamId');
    localStorage.removeItem('favoriteBasketballTeam');
    localStorage.removeItem('favoriteBasketballTeamId');
    navigate('/login');
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedUsername = localStorage.getItem('userName') || "Guest";
      setUsername(storedUsername);
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="navbar">
      <div className="navbar__top">
        <div className="navbar__user">
          <div className="navbar__user-pic-container">
            <img src={logo} alt="User" className="navbar__user-pic" />
          </div>
          <h3 className="navbar__user-name">{username}</h3>
        </div>
        <nav className="navbar__nav">
          <Link to="/" className="navbar__link">
            <FaHome className="navbar__icon" />
            Home
          </Link>
          <Link to="/sports" className="navbar__link">
            <FaFutbol className="navbar__icon" />
            Sports
          </Link>
          <Link to="/workout" className="navbar__link">
            <FaDumbbell className="navbar__icon" />
            Workout
          </Link>
          <Link to="/workoutplans" className="navbar__link">
            <FaTasks className="navbar__icon" />
            Workout Plans
          </Link>
          <Link to="/runs" className="navbar__link">
            <FaRunning className="navbar__icon" />
            Runs
          </Link>
          <Link to="/tracker" className="navbar__link">
            <FaChartPie className="navbar__icon" />
            Calorie Tracking
          </Link>
          <Link to="/quiz" className="navbar__link">
            <MdOutlineQuiz className="navbar__icon" />
            Quiz
          </Link>
          <Link to="/settings" className="navbar__link">
          <FaCog className="navbar__icon" />
          Settings
        </Link>
        <button onClick={handleLogout} className="navbar__link">
          <FaSignOutAlt className="navbar__icon" />
          Log out
        </button>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
