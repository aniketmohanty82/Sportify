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
  const [username, setUsername] = useState(localStorage.getItem('userName') || "Guest");

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
    <div className="homepage-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <header className="header" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', color: '#ffffff' }}>Hey, {username}! Welcome Back!</h1>
      </header>
  
      {/* Soccer Section */}
      <Card
        elevation={3}
        style={{
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '15px',
          boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h5" style={{ marginBottom: '10px', color: '#1aa64b' }}>Soccer</Typography>
        {soccerTeamData ? (
          <Box style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
            {/* Team Information */}
            <Box style={{ flex: 1 }}>
              <Avatar
                src={soccerTeamData.team.logo}
                alt={soccerTeamData.team.name}
                style={{ width: '80px', height: '80px', marginBottom: '10px' }}
              />
              <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1aa64b' }}>{soccerTeamData.team.name}</Typography>
              <Typography>Games Played: {soccerTeamData.fixtures.played.total}</Typography>
              <Typography>Wins: {soccerTeamData.fixtures.wins.total}</Typography>
              <Typography>Losses: {soccerTeamData.fixtures.loses.total}</Typography>
              <Typography>Draws: {soccerTeamData.fixtures.draws.total}</Typography>
            </Box>
  
            {/* Goals Section */}
            <Box style={{ flex: 1 }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>Goals</Typography>
              <Typography>Total Goals Scored: {soccerTeamData.goals.for.total.total}</Typography>
              <Typography>Total Goals Conceded: {soccerTeamData.goals.against.total.total}</Typography>
              <Typography>Avg Goals Scored/Game: {(
                soccerTeamData.goals.for.total.total / soccerTeamData.fixtures.played.total
              ).toFixed(2)}</Typography>
              <Typography>Avg Goals Conceded/Game: {(
                soccerTeamData.goals.against.total.total / soccerTeamData.fixtures.played.total
              ).toFixed(2)}</Typography>
            </Box>
  
            {/* Lineups Section */}
            <Box style={{ flex: 1 }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>Common Lineups</Typography>
              {soccerTeamData.lineups.length > 0 ? (
                soccerTeamData.lineups.map((lineup, index) => (
                  <Typography key={index}>{lineup.formation} ({lineup.played} matches)</Typography>
                ))
              ) : (
                <Typography>No lineups data available.</Typography>
              )}
            </Box>
  
            {/* Form Section */}
            <Box style={{ flex: 1 }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>Form</Typography>
              <Box style={{ display: 'flex', gap: '5px' }}>
                {soccerTeamData.form.split('').map((letter, index) => (
                  <Typography
                    key={index}
                    style={{
                      fontWeight: 'bold',
                      color: letter === 'W' ? '#1aa64b' : letter === 'L' ? 'red' : 'orange',
                    }}
                  >
                    {letter}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography>No soccer data available.</Typography>
        )}
      </Card>
  
      {/* Basketball Section */}
      <Card
        elevation={3}
        style={{
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '15px',
          boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h5" style={{ marginBottom: '10px', color: '#1aa64b' }}>Basketball</Typography>
        {basketballTeamData ? (
          <Box style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
            {/* Team Information */}
            <Box style={{ flex: 1 }}>
              <Avatar
                src={basketballTeamData.team.logo}
                alt={basketballTeamData.team.name}
                style={{ width: '80px', height: '80px', marginBottom: '10px' }}
              />
              <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1aa64b' }}>{basketballTeamData.team.name}</Typography>
              <Typography>Record: {basketballTeamData.games.wins.all.total} - {basketballTeamData.games.loses.all.total}</Typography>
            </Box>
  
            {/* Win Percentage */}
            <Box style={{ flex: 1 }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>Win Percentage</Typography>
              <Typography>Home: {basketballTeamData.games.wins.home.percentage}</Typography>
              <Typography>Away: {basketballTeamData.games.wins.away.percentage}</Typography>
            </Box>
  
            {/* Points Section */}
            <Box style={{ flex: 1 }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>Points</Typography>
              <Typography>Avg Points Scored/Game: {basketballTeamData.points.for.average.all}</Typography>
              <Typography>Avg Points Conceded/Game: {basketballTeamData.points.against.average.all}</Typography>
            </Box>
          </Box>
        ) : (
          <Typography>No basketball data available.</Typography>
        )}
      </Card>
  
      {/* Bottom Widgets Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', height: '200px' }}>
{/* Calories Widget */}
<Card
  elevation={3}
  style={{
    flex: 1,
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '15px',
    boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <Typography
    variant="h6"
    style={{
      textAlign: 'center',
      color: '#1aa64b',
      marginBottom: '10px',
    }}
  >
    Calories
  </Typography>
  <div
    style={{
      width: '80px', // Adjusted size to fit the widget while keeping proportions
      height: '80px', // Ensures a square progress bar
      margin: '10px 0',
    }}
  >
    <CircularProgressbar
      value={caloriePercentage}
      text={`${Math.round(caloriePercentage)}%`}
      styles={buildStyles({
        textSize: '12px', // Slightly smaller text to fit the resized progress bar
        pathColor: `rgba(26, 166, 75, 1)`,
        textColor: '#1aa64b',
        trailColor: '#d6d6d6',
      })}
    />
  </div>
  <Typography
    style={{
      textAlign: 'center',
      fontSize: '14px', // Reduced font size to maintain balance
      marginTop: '10px',
    }}
  >
    {totalCalories} / {dailyCalorieGoal} Calories
  </Typography>
</Card>

  
        {/* Workouts Widget */}
        <Card
          elevation={3}
          style={{
            flex: 1,
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '15px',
            boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" style={{ textAlign: 'center', color: '#1aa64b' }}>Workouts</Typography>
          {workouts.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
              {workouts.map((workout) => (
                <li key={workout._id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  <strong>{workout.exercise}</strong>: {workout.sets} sets, {workout.reps} reps
                </li>
              ))}
            </ul>
          ) : (
            <Typography style={{ textAlign: 'center', color: '#666' }}>No workout data available.</Typography>
          )}
        </Card>
  
        {/* Shortcuts Section */}
        <Card elevation={3} style={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '15px', boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)' }}>
          <Typography variant="h6" style={{ textAlign: 'center', color: '#1aa64b' }}>Shortcuts</Typography>
          <button onClick={handleOpenModal} style={{ width: '100%', marginBottom: '10px' }}>Add a Meal</button>
          <button onClick={handleOpenModalWorkout} style={{ width: '100%', marginBottom: '10px' }}>Add an Exercise</button>
          <button onClick={() => setIsFormOpen(true)} style={{ width: '100%' }}>Add a Run</button>
        </Card>
      </div>
      <MealLogForm isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormSubmit} onError={handleCloseModal} />
        <WorkoutLogForm isOpen={isWorkoutModalOpen} onClose={handleCloseModalWorkout} onSubmit={handleWorkoutSubmit} />
        <RunLogForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={logRun}
          darkMode={false}
        />
    </div>
  );
  
  
};

export default HomePage;
