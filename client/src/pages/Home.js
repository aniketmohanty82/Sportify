import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Paper, Box, Typography, Button } from '@mui/material';
import { green } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import '../HomePage.css';

const HomePage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [mealLogs, setMealLogs] = useState([]);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2500);
  const [caloriePercentage, setCaloriePercentage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchWorkouts();
    fetchMealLogs();
  }, []);

  useEffect(() => {
    calculateTotalCalories();
  }, [mealLogs]);

  const calculateTotalCalories = () => {
    const totalCalories = mealLogs.reduce((acc, meal) => acc + (meal.nutrients || 0), 0);
    const percentage = Math.min((totalCalories / dailyCalorieGoal) * 100, 100);
    setTotalCalories(totalCalories);
    setCaloriePercentage(percentage);
  };

  const premierLeagueGames = [
    { teams: ['Manchester United', 'Chelsea'], scores: [2, 1] },
    { teams: ['Liverpool', 'Arsenal'], scores: [1, 1] },
  ];

  const Nba = [
    { teams: ['Spurs', 'Mavs'], scores: [100, 110] },
    { teams: ['Bucks', 'Celtics'], scores: [80, 125] },
  ];

  const renderMatch = (game, index) => {
    const winner = game.scores[0] > game.scores[1] ? game.teams[0] : game.scores[0] === game.scores[1] ? null : game.teams[1];
    return (
      <Paper key={index} elevation={3} sx={{ p: 1, m: 1, minWidth: '200px' }}>
        <Typography variant="h6">Match {index + 1}</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>{game.teams[0]}</Typography>
          <Box display="flex" alignItems="center">
            <Typography>{game.scores[0]}</Typography>
            <Box
              sx={{
                bgcolor: game.teams[0] === winner ? green[500] : 'transparent',
                width: 10,
                height: 10,
                borderRadius: '50%',
                ml: 1,
              }}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>{game.teams[1]}</Typography>
          <Box display="flex" alignItems="center">
            <Typography>{game.scores[1]}</Typography>
            <Box
              sx={{
                bgcolor: game.teams[1] === winner ? green[500] : 'transparent',
                width: 10,
                height: 10,
                borderRadius: '50%',
                ml: 1,
              }}
            />
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
        <section className="favorites-section" style={{ marginBottom: '10px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '10px', boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)' }}>
            <Box
              sx={{
                display: 'flex',
                overflowX: 'auto',
                p: 1,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#fff',
                '&::-webkit-scrollbar': { display: 'none' },
                mb: 1,
              }}
            >
              {premierLeagueGames.map((game, index) => renderMatch(game, index))}
            </Box>
          </section>

          <section className="favorites-section" style={{ marginBottom: '10px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '10px', boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)' }}>
            <Box
              sx={{
                display: 'flex',
                overflowX: 'auto',
                p: 1,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#fff',
                '&::-webkit-scrollbar': { display: 'none' },
                mb: 1,
              }}
            >
              {Nba.map((game, index) => renderMatch(game, index))}
            </Box>
          </section>

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
                <p>{totalCalories} / {dailyCalorieGoal} Calories</p>
              </div>
            </div>

            <div className="widget tasks-widget">
              <h3>Tasks</h3>
              <ul>
                <li>Sample Task 1</li>
                <li>Sample Task 2</li>
                <li>Sample Task 3</li>
              </ul>
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
          <section className="news-section">
            <h2>News</h2>
            <ul>
              <li>Sample News 1</li>
              <li>Sample News 2</li>
              <li>Sample News 3</li>
            </ul>
          </section>
          <section className="shortcuts-section">
            <h2>Shortcuts</h2>
            <Button className="shortcut-button">Add a food item</Button>
            <Button className="shortcut-button">Add a Task</Button>
            <Button className="shortcut-button">Toggle theme</Button>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
