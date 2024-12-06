// HomePage.js

import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Avatar, Card, CardContent, Paper, Box, Typography, Button } from '@mui/material';
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
  const [soccerTeamData, setSoccerTeamData] = useState(null);
  const [basketballTeamData, setBasketballTeamData] = useState(null);

  const favoriteSoccerTeamId = localStorage.getItem('favoriteSoccerTeamId');
  const favoriteSoccerTeam = localStorage.getItem('favoriteSoccerTeam');
  const favoriteBasketballTeamId = localStorage.getItem('favoriteBasketballTeamId');
  console.log('Favorite Basketball Team ID:', favoriteBasketballTeamId);
  const favoriteBasketballTeam = localStorage.getItem('favoriteBasketballTeam');


  useEffect(() => {
    // Fetch team statistics from the API
    const fetchTeamStatistics = async () => {
      if (!favoriteSoccerTeamId) return;

      try {
        const response = await fetch(`http://localhost:5001/api/team_statistics/${favoriteSoccerTeamId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch team statistics');
        }

        const data = await response.json();
        setSoccerTeamData(data); // Store the data in the state
      } catch (err) {
        console.error('Error fetching team statistics:', err);
      }
    };

    fetchTeamStatistics();
  }, [favoriteSoccerTeamId]);

  useEffect(() => {
    // Fetch team statistics from the API
    const fetchBasketballTeamStatistics = async () => {
      if (!favoriteBasketballTeamId) return;

      try {
        const response = await fetch(`http://localhost:5001/api/basketball_team_statistics/${favoriteBasketballTeamId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch bteam statistics');
        }

        const data = await response.json();
        console.log(data);
        setBasketballTeamData(data); // Store the data in the state
      } catch (err) {
        console.error('Error fetching bteam statistics:', err);
      }
    };

    fetchBasketballTeamStatistics();
  }, [favoriteBasketballTeamId]);


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
      {/* Soccer Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
        <Typography variant="h5" className="section-subtitle" style={{ color: green[500] }}>
          Soccer
        </Typography>
        {soccerTeamData ? (
          <Card elevation={3} sx={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
            {/* Horizontal Layout */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
              {/* Team Information */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '20px' }}>
                  <Avatar
                    src={soccerTeamData.team.logo}
                    alt={soccerTeamData.team.name}
                    sx={{ width: 80, height: 80 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: green[500] }}>
                    {soccerTeamData.team.name}
                  </Typography>
                </Box>
                <Typography variant="body2">Games Played: {soccerTeamData.fixtures.played.total}</Typography>
                <Typography variant="body2">Wins: {soccerTeamData.fixtures.wins.total}</Typography>
                <Typography variant="body2">Losses: {soccerTeamData.fixtures.loses.total}</Typography>
                <Typography variant="body2">Draws: {soccerTeamData.fixtures.draws.total}</Typography>
              </Box>

              {/* Goals Section */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px' }}>
                  Goals
                </Typography>
                <Typography variant="body2">
                  Total Goals Scored: {soccerTeamData.goals.for.total.total}
                </Typography>
                <Typography variant="body2">
                  Total Goals Conceded: {soccerTeamData.goals.against.total.total}
                </Typography>
                <Typography variant="body2">
                  Avg Goals Scored/Game: {(
                    soccerTeamData.goals.for.total.total /
                    soccerTeamData.fixtures.played.total
                  ).toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  Avg Goals Conceded/Game: {(
                    soccerTeamData.goals.against.total.total /
                    soccerTeamData.fixtures.played.total
                  ).toFixed(2)}
                </Typography>
              </Box>

              {/* Lineups Section */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px' }}>
                  Common Lineups
                </Typography>
                {soccerTeamData.lineups.length > 0 ? (
                  soccerTeamData.lineups.map((lineup, index) => (
                    <Typography key={index} variant="body2">
                      {lineup.formation} ({lineup.played} matches)
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">No lineups data available.</Typography>
                )}
              </Box>

              {/* Form Section */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px' }}>
                  Form
                </Typography>
                <Box sx={{ display: 'flex', gap: '5px' }}>
                  {soccerTeamData.form.split('').map((letter, index) => (
                    <Typography
                      key={index}
                      sx={{
                        fontWeight: 'bold',
                        color: letter === 'W' ? green[500] : letter === 'L' ? 'red' : 'orange',
                      }}
                    >
                      {letter}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          </Card>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No favorite soccer team data available.
          </Typography>
        )}
      </Box>

      {/* Basketball Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
        <Typography variant="h5" className="section-subtitle" style={{ color: green[500] }}>
          Basketball
        </Typography>
        {basketballTeamData ? (
          <Card elevation={3} sx={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
            {/* Horizontal Layout */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
              {/* Team Information */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '20px' }}>
                  <Avatar
                    src={basketballTeamData.team.logo}
                    alt={basketballTeamData.team.name}
                    sx={{ width: 80, height: 80 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: green[500] }}>
                    {basketballTeamData.team.name}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Record: <span style={{ color: green[500] }}>{basketballTeamData.games.wins.all.total}</span> -
                  <span style={{ color: 'red' }}>{basketballTeamData.games.loses.all.total}</span>
                </Typography>
              </Box>

              {/* Win Percentage Section */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px' }}>
                  Win Percentage
                </Typography>
                <Typography variant="body2">Home: {basketballTeamData.games.wins.home.percentage}</Typography>
                <Typography variant="body2">Away: {basketballTeamData.games.wins.away.percentage}</Typography>
              </Box>

              {/* Average Points Section */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px' }}>
                  Points
                </Typography>
                <Typography variant="body2">
                  Avg Points Scored/Game: {basketballTeamData.points.for.average.all}
                </Typography>
                <Typography variant="body2">
                  Avg Points Conceded/Game: {basketballTeamData.points.against.average.all}
                </Typography>
              </Box>
            </Box>
          </Card>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No favorite basketball team data available.
          </Typography>
        )}
      </Box>



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
