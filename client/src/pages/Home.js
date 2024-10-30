import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useNavigate } from 'react-router-dom'; 
import '../HomePage.css'; // Ensure this CSS file has the necessary styles

const HomePage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [mealLogs, setMealLogs] = useState([]);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2500); // Adjust daily goal
  const [caloriePercentage, setCaloriePercentage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/workouts', {
          method: 'GET',
          headers: {
            'x-auth-token': token,
          },
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
          headers: {
            'x-auth-token': token,
          },
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
    calculateTotalCalories()
  }, [mealLogs]); // This effect depends on mealLogs

  const calculateTotalCalories = () => {
    console.log(mealLogs)
    const totalCalories = mealLogs.reduce((acc, meal) => acc + (meal.nutrients || 0), 0);
    const percentage = Math.min((totalCalories / dailyCalorieGoal) * 100, 100);
    setTotalCalories(totalCalories);
    setCaloriePercentage(percentage);
  };

  return (
    <div className="homepage-container">
      <header className="header">
        <h1>Hey, Dhruv! Welcome Back!</h1>
      </header>
      <div className="content-container">

        {/* Main Content Area */}
        <main className="main-content">
          <section className="favorites-section">
            <h2>Your Favorites</h2>
            <h3>Soccer scores:</h3>
            <p>Spurs 1 - 1 Chelsea</p>
            <p>City 1 - 1 Arsenal</p>
            <h3>Basketball scores:</h3>
            <p>Lakers 100 - 100 Bucks</p>
            <p>Jazz 100 - 100 Pacers</p>
          </section>

          <div className="dashboard-widgets">
            {/* Calories Widget */}
            <div className="widget calorie-widget">
              <h3>Calories</h3>
              <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar
                  value={caloriePercentage}
                  text={`${Math.round(caloriePercentage)}%`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: `rgba(26, 166, 75, 1)`,
                    textColor: '#000',
                    trailColor: '#d6d6d6',
                  })}
                />
                <p>{totalCalories} / {dailyCalorieGoal} Calories</p>
              </div>
            </div>

            {/* Tasks Widget */}
            <div className="widget tasks-widget">
              <h3>Tasks</h3>
              <ul>
                <li>Sample Task 1</li>
                <li>Sample Task 2</li>
                <li>Sample Task 3</li>
              </ul>
            </div>

            {/* Workouts Widget */}
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

        {/* Right Sidebar */}
        <aside className="sidebar right-sidebar">
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
            <button>Add a food item</button>
            <button>Add a Task</button>
            <button>Toggle theme</button>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
