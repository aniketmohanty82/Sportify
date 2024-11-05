// HomePage.js

import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Paper, Box, Typography, Button } from '@mui/material';
import { green } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import '../HomePage.css';
import 'react-circular-progressbar/dist/styles.css';
import { AiOutlinePlus } from 'react-icons/ai';
import MealLogForm from '../components/MealLogForm';
import WorkoutLogForm from '../components/WorkoutLogForm';
import RunLogForm from '../components/RunLogForm';

const HomePage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [mealLogs, setMealLogs] = useState([]);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2500);
  const [caloriePercentage, setCaloriePercentage] = useState(0);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/workouts', {
        method: 'GET',
        headers: { 'x-auth-token': token },
      });

      if (response.ok) {
        const workoutLogs = await response.json();
        setWorkouts(workoutLogs);
      } else {
        console.error('Failed to fetch workouts');
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const fetchMealLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/meals', {
        headers: { 'x-auth-token': token },
      });

      if (response.ok) {
        const data = await response.json();
        setMealLogs(data);
        calculateTotalCalories();
      } else if (response.status === 401) {
        navigate('/login');
      } else {
        console.error('Failed to fetch meal logs');
      }
    } catch (error) {
      console.error('Error fetching meal logs:', error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
    fetchMealLogs();
  }, []);

  useEffect(() => {
    calculateTotalCalories();
  }, [mealLogs]);

  const calculateTotalCalories = () => {
    const totalCalories = mealLogs.reduce(
      (acc, meal) => acc + (meal.nutrients || 0),
      0
    );
    const percentage = Math.min(
      (totalCalories / dailyCalorieGoal) * 100,
      100
    );
    setTotalCalories(totalCalories);
    setCaloriePercentage(percentage);
  };

  const premierLeagueGames = [
    { teams: ['Manchester United', 'Chelsea'], scores: [2, 1] },
    { teams: ['Liverpool', 'Arsenal'], scores: [1, 1] },
  ];

  const nbaGames = [
    { teams: ['Spurs', 'Mavericks'], scores: [100, 110] },
    { teams: ['Bucks', 'Celtics'], scores: [80, 125] },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (data) => {
    console.log('Meal logged:', data);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/meals/logmeal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Include the token in the headers
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchMealLogs();
      } else if (response.status === 401) {
        // Unauthorized, redirect to login
        navigate('/login');
      } else {
        console.error('Failed to log meal');
      }
    } catch (error) {
      console.error('Error logging meal:', error);
    }
  };

  const handleOpenModalWorkout = () => {
    setIsWorkoutModalOpen(true);
  };

  const handleCloseModalWorkout = () => {
    setIsWorkoutModalOpen(false);
  };

  const handleWorkoutSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5001/api/workouts/logworkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      await fetchWorkouts();
    } catch (error) {
      console.error('Error logging workout:', error);
    }
  };

  const logRun = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch('http://localhost:5001/api/runs/logrun', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error logging run: ${errorText}`);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error logging run:', error.message);
      alert(error.message);
    }
  };


  const renderMatch = (game, index) => {
    const winner =
      game.scores[0] > game.scores[1]
        ? game.teams[0]
        : game.scores[0] === game.scores[1]
        ? null
        : game.teams[1];
    return (
      <Paper
        key={index}
        elevation={3}
        className="match-card"
      >
        <Typography variant="h6" className="match-title">
          {game.teams[0]} vs {game.teams[1]}
        </Typography>
        <Box className="match-details">
          <Box className="team-score">
            <Typography>{game.teams[0]}</Typography>
            <Typography>{game.scores[0]}</Typography>
            {winner === game.teams[0] && <span className="winner-dot" />}
          </Box>
          <Box className="team-score">
            <Typography>{game.teams[1]}</Typography>
            <Typography>{game.scores[1]}</Typography>
            {winner === game.teams[1] && <span className="winner-dot" />}
          </Box>
        </Box>
      </Paper>
    );
  };

  return (
    <div className="homepage-container">
      <header className="header">
        <h1>Hey, Dhruv! Welcome Back!</h1>
      </header>
      <div className="content-container">
        <main className="main-content">
          {/* Favorites Sections */}
          <section className="favorites-section">
            <Typography variant="h5" className="section-title">
              PL Highlights
            </Typography>
            <Box className="matches-container">
              {premierLeagueGames.map((game, index) => renderMatch(game, index))}
            </Box>
          </section>

          <section className="favorites-section">
            <Typography variant="h5" className="section-title">
              NBA Highlights
            </Typography>
            <Box className="matches-container">
              {nbaGames.map((game, index) => renderMatch(game, index))}
            </Box>
          </section>

          {/* Dashboard Widgets */}
          <div className="dashboard-widgets">
            <div className="widget calorie-widget">
              <h3>Calories</h3>
              <div className="progress-bar">
                <CircularProgressbar
                  value={caloriePercentage}
                  text={`${Math.round(caloriePercentage)}%`}
                  styles={buildStyles({
                    textSize: '14px',
                    pathColor: `rgba(26, 166, 75, 1)`,
                    textColor: '#000',
                    trailColor: '#d6d6d6',
                  })}
                />
                <p>
                  {totalCalories} / {dailyCalorieGoal} Calories
                </p>
              </div>
            </div>

            <div className="widget workouts-widget">
              <h3>Workouts</h3>
              <div className="workouts-list">
                <ul>
                  {workouts.map((workout) => (
                    <li key={workout._id}>
                      <strong>Exercise:</strong> {workout.exercise} <br />
                      <strong>Sets:</strong> {workout.sets} <br />
                      <strong>Reps:</strong> {workout.reps} <br />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>

        <aside className="sidebar">
          <section className="shortcuts-section">
            <h2>Shortcuts</h2>
             {/* Add New Meal Button */}
      <button
        title="Add New"
        className="group flex items-center cursor-pointer outline-none hover:shadow-lg duration-300 transition-transform transform hover:scale-105"
        onClick={handleOpenModal}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        style={{
          backgroundColor: '#1aa64b',
          color: '#fff',
          padding: '10px 15px',
          borderRadius: '10px',
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        <AiOutlinePlus
          size={24}
          className="stroke-zinc-400 fill-none group-hover:fill-zinc-800 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300"
        />
        <span style={{ marginLeft: '8px' }}>Add a meal</span>
      </button>
      <button
        title="Add New Exercise"
        style={{
          backgroundColor: '#1aa64b',
          color: '#fff',
          padding: '10px 15px',
          borderRadius: '10px',
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'transform 0.2s ease',
        }}
        onClick={handleOpenModalWorkout}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <AiOutlinePlus size={24} />
        <span style={{ marginLeft: '8px' }}>Add an Exercise</span>
      </button>
      <button
        title="Add New Run"
        style={{
          backgroundColor: '#1aa64b',
          color: '#fff',
          padding: '10px 15px',
          borderRadius: '10px',
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'transform 0.2s ease',
        }}
        onClick={() => setIsFormOpen(true)}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <AiOutlinePlus size={24} />
        <span style={{ marginLeft: '8px' }}>Add a run</span>
      </button>
          </section>
        </aside>

        <MealLogForm isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormSubmit} onError={handleCloseModal} />
        <WorkoutLogForm isOpen={isWorkoutModalOpen} onClose={handleCloseModalWorkout} onSubmit={handleWorkoutSubmit} />
        <RunLogForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={logRun}
        darkMode={false}
      />
      </div>
    </div>
  );
};

export default HomePage;
