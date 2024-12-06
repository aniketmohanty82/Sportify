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
  const [favoriteSoccerTeam, setFavoriteSoccerTeam] = useState(''); // Tracks the user's favorite soccer team
  const [favoriteSoccerTeamId, setFavoriteSoccerTeamId] = useState('');
  const [favoriteBasketballTeam, setFavoriteBasketballTeam] = useState(''); // Tracks the user's favorite basketball team
  const [favoriteBasketballTeamId, setFavoriteBasketballTeamId] = useState('');
  const [userTimeZone, setUserTimeZone] = useState('');
  const [workoutGoal, setWorkoutGoal] = useState('');
  const [calorieGoal, setCalorieGoal] = useState('');
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
        const response = await fetch(`https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/users/${userId}`, {
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
            workoutGoal: data.workoutGoal,
            calorieGoal: data.calorieGoal,
          });
          setUserTimeZone(data.timezone);
          setFavoriteSoccerTeam(data.favoriteSoccerTeam ?? 'Arsenal');
          setFavoriteSoccerTeamId(data.favoriteSoccerTeamId ?? 42);
          setFavoriteBasketballTeam(data.favoriteBasketballTeam ?? 'Los Angeles Lakers');
          setFavoriteBasketballTeamId(data.favoriteBasketballTeamId ?? 145);
          setCalorieGoal(data.calorieGoal ?? 0)
          setWorkoutGoal(data.workoutGoal ?? 0)

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
      const response = await fetch(`https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/users/darkMode?userId=${userId}`, {
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
      fetch(`https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/users/update-darkMode`, {
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
      const response = await fetch('https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/users/update-timezone', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ userId, timezone: timeZone }),
      });

      if (response.ok) {
        setMessage('Time zone updated successfully!');
        console.log("before removal", localStorage.getItem('timeZone'))
        localStorage.removeItem('timeZone')
        localStorage.setItem('timeZone', timeZone)
        console.log("after removal", localStorage.getItem('timeZone'))
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

  const handleWorkoutGoalSave = async () => {
    try {
      const response = await fetch('https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/users/update-workoutGoal', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, workoutGoal }), // Replace USER_ID dynamically
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        localStorage.removeItem('workoutGoal')
        localStorage.setItem('workoutGoal', workoutGoal);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      setError('Failed to update workout goal.');
    }
  };

  const handleCalorieGoalSave = async () => {
    try {
      const response = await fetch('https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/users/update-calorieGoal', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId , calorieGoal }), // Replace USER_ID dynamically
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        localStorage.removeItem('calorieGoal')
        localStorage.setItem('calorieGoal', calorieGoal);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      setError('Failed to update calorie goal.');
    }
  };

  const handleFavoriteBasketballTeamSave = async (team, teamId) => {
    try {
      // Update the state locally before API call
      setFavoriteBasketballTeam(team);
  
      const response = await fetch('https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/users/update-favoriteBasketballTeam', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ userId, favoriteBasketballTeam: team, favoriteBasketballTeamId: teamId }),
      });
  
      if (response.ok) {
        // Store updated values in localStorage
        localStorage.setItem('favoriteBasketballTeam', team);
        localStorage.setItem('favoriteBasketballTeamId', teamId);
  
        // Show success message
        setMessage('Favorite Basketball Team updated successfully!');
  
        // Reload the page to ensure the updates reflect throughout the app
        // window.location.reload();
      } else {
        // Handle errors from the server response
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update favorite basketball team');
      }
    } catch (error) {
      // Handle unexpected errors
      setError('Error updating favorite basketball team');
      console.error(error);
    }
  };


  const handleFavoriteSoccerTeamSave = async (team, teamId) => {
    try {
      // Update the state locally before API call
      setFavoriteSoccerTeam(team);
  
      const response = await fetch('https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/users/update-favoriteSoccerTeam', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ userId, favoriteSoccerTeam: team, favoriteSoccerTeamId: teamId }),
      });
  
      if (response.ok) {
        // Store updated values in localStorage
        localStorage.setItem('favoriteSoccerTeam', team);
        localStorage.setItem('favoriteSoccerTeamId', teamId);
  
        // Show success message
        setMessage('Favorite Soccer Team updated successfully!');
  
        // Reload the page to ensure the updates reflect throughout the app
        // window.location.reload();
      } else {
        // Handle errors from the server response
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update favorite soccer team');
      }
    } catch (error) {
      // Handle unexpected errors
      setError('Error updating favorite soccer team');
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
      const response = await fetch(`https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/users/${userId}`, {
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

  const favoriteSoccerTeams = [
    ['Arsenal', 42],
    ['Aston Villa', 66],
    ['Bournemouth', 35],
    ['Brentford', 55],
    ['Brighton', 51],
    ['Ipswich', 57],
    ['Chelsea', 49],
    ['Crystal Palace', 52],
    ['Everton', 45],
    ['Fulham', 36],
    ['Liverpool', 40],
    ['Southampton', 41],
    ['Manchester City', 50],
    ['Manchester United', 33],
    ['Newcastle United', 34],
    ['Nottingham Forest', 65],
    ['Leicester City', 46],
    ['Tottenham', 47],
    ['West Ham', 48],
    ['Wolves', 39],
  ];

  const favoriteBasketballTeams = [
    ['Atlanta Hawks', 132],
    ['Boston Celtics', 133],
    ['Brooklyn Nets', 134],
    ['Charlotte Hornets', 135],
    ['Chicago Bulls', 136],
    ['Cleveland Cavaliers', 137],
    ['Dallas Mavericks', 138],
    ['Denver Nuggets', 139],
    ['Detroit Pistons', 140],
    ['Golden State Warriors', 141],
    ['Houston Rockets', 142],
    ['Indiana Pacers', 143],
    ['Los Angeles Clippers', 144],
    ['Los Angeles Lakers', 145],
    ['Memphis Grizzlies', 146],
    ['Miami Heat', 147],
    ['Milwaukee Bucks', 148],
    ['Minnesota Timberwolves', 149],
    ['New Orleans Pelicans', 150],
    ['New York Knicks', 151],
    ['Oklahoma City Thunder', 152],
    ['Orlando Magic', 153],
    ['Philadelphia 76ers', 154],
    ['Phoenix Suns', 155],
    ['Portland Trail Blazers', 156],
    ['Sacramento Kings', 157],
    ['San Antonio Spurs', 158],
    ['Toronto Raptors', 159],
    ['Utah Jazz', 160],
    ['Washington Wizards', 161],
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
        <div className="profile-item">
          <label>Favorite Soccer Team:</label>
          <span>{favoriteSoccerTeam}</span>
        </div>
        <div className="profile-item">
          <label>Favorite Basketball Team:</label>
          <span>{favoriteBasketballTeam}</span>
        </div>
        <div className="profile-item">
          <label>Workout Goal (Sets):</label>
          <span>{workoutGoal}</span>
        </div>
        <div className="profile-item">
          <label>Calorie Goal:</label>
          <span>{calorieGoal}</span>
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

      <div className="timezone-form">
        <h3>Select Your Favorite Soccer Team</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={favoriteSoccerTeam}
            onChange={(e) => {
              const selectedTeam = favoriteSoccerTeams.find(
                ([teamName]) => teamName === e.target.value
              );
              if (selectedTeam) {
                setFavoriteSoccerTeam(selectedTeam[0]); // Set team name
                setFavoriteSoccerTeamId(selectedTeam[1]); // Set team ID
              }
            }}
            className="button"
          >
            {favoriteSoccerTeams.map(([teamName, teamId]) => (
              <option key={teamId} value={teamName}>
                {teamName}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => handleFavoriteSoccerTeamSave(favoriteSoccerTeam, favoriteSoccerTeamId)}
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

      <div className="timezone-form">
        <h3>Select Your Favorite Basketball Team</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={favoriteBasketballTeam}
            onChange={(e) => {
              const selectedTeam = favoriteBasketballTeams.find(
                ([teamName]) => teamName === e.target.value
              );
              if (selectedTeam) {
                setFavoriteBasketballTeam(selectedTeam[0]); // Set team name
                setFavoriteBasketballTeamId(selectedTeam[1]); // Set team ID
              }
            }}
            className="button"
          >
            {favoriteBasketballTeams.map(([teamName, teamId]) => (
              <option key={teamId} value={teamName}>
                {teamName}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => handleFavoriteBasketballTeamSave(favoriteBasketballTeam, favoriteBasketballTeamId)}
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

      {/* Section to Update Workout Goal */}
      <div className="goal-form">
        <h3>Set Your Workout Goal</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            value={workoutGoal}
            onChange={(e) => setWorkoutGoal(e.target.value)}
            placeholder="Enter your workout goal"
            className="button"
            style={{ flex: 1, padding: '10px' }}
          />
          <button
            type="button"
            onClick={handleWorkoutGoalSave}
            className="button save-button"
          >
            Save
          </button>
        </div>
      </div>

      {/* Section to Update Calorie Goal */}
      <div className="goal-form">
        <h3>Set Your Calorie Goal</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="number"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(e.target.value)}
            placeholder="Enter your calorie goal"
            className="button"
            style={{ flex: 1, padding: '10px' }}
          />
          <button
            type="button"
            onClick={handleCalorieGoalSave}
            className="button save-button"
          >
            Save
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
