/*Sportify/client/src/pages/Workout.js*/

import React, { useState, useEffect } from 'react';
import WorkoutLogForm from '../components/WorkoutLogForm';
import { AiOutlinePlus } from 'react-icons/ai';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Button, Box, Typography, Paper, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Modal, IconButton, LinearProgress } from '@mui/material';
import RunLogForm from '../components/RunLogForm';
import ConfirmDeleteRunModal from '../components/ConfirmDeleteRunModal';
import EditRunModal from '../components/EditRunModal';
import RunDistanceChart from '../components/RunDistanceChart';
import SpeedGraph from '../components/SpeedGraph';
import '../RunLogStyles.css';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Workout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [weeklyConsistency, setWeeklyConsistency] = useState(0);
  const [workoutGaps, setWorkoutGaps] = useState([]);
  const [longestStreak, setLongestStreak] = useState(0);
  const [timeframe, setTimeframe] = useState('month');
  const [consistencyData, setConsistencyData] = useState({ labels: [], datasets: [] });
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [timeframeProgress, setTimeframeProgress] = useState('month');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [selectedDate, setSelectedDate] = useState('');
  const [groupedWorkouts2, setGroupedWorkouts2] = useState({});
  const [isWorkoutDropdownOpen, setIsWorkoutDropdownOpen] = useState(false);
  const [isRunDropdownOpen, setIsRunDropdownOpen] = useState(false);
  const [workoutTimeframe, setWorkoutTimeframe] = useState('');
  const [workoutFormat, setWorkoutFormat] = useState('');
  const [runTimeframe, setRunTimeframe] = useState('');
  const [runFormat, setRunFormat] = useState('');
  const [page, setPage] = useState('workout'); // Default to "workout"

  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [runs, setRuns] = useState([]);
  const [currentRun, setCurrentRun] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [timeFrame, setTimeFrame] = useState('week');
  const [darkMode, setDarkMode] = useState(false);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

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


  // Fetch runs data from the backend
  const fetchRuns = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch('https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/api/runs', {
        headers: { 'x-auth-token': token },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching runs: ${errorText}`);
      }

      const runData = await response.json();
      setRuns(runData);
    } catch (error) {
      console.error('Error fetching runs:', error.message);
      setFetchError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Log a new run
  const logRun = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch('https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/api/runs/logrun', {
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

      fetchRuns(); // Refresh data
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error logging run:', error.message);
      alert(error.message);
    }
  };

  // Edit a run
  const editRun = async (updatedRun) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/api/runs/${updatedRun._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(updatedRun),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating run: ${errorText}`);
      }

      fetchRuns(); // Refresh data after successful edit
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating run:', error.message);
      alert(error.message);
    }
  };

  const deleteRun = async (runId) => {
    console.log("Attempting to delete run with ID:", runId); // Check if the correct ID is being passed
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/api/runs/${runId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error deleting run: ${errorText}`);
      }
  
      fetchRuns(); // Refresh the list of runs
      setIsEditModalOpen(false); // Close the edit modal after deletion
    } catch (error) {
      console.error('Error deleting run:', error.message);
      alert(error.message);
    }
  };  

  useEffect(() => {
    fetchRuns();
    fetchDarkModeSetting()
  }, []);

  const filterRunsByTimeFrame = (runs, timeFrame) => {
    const now = new Date();
    let startDate;

    switch (timeFrame) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        return runs;
    }

    return runs.filter(run => new Date(run.date) >= startDate);
  };

  const filteredRuns = filterRunsByTimeFrame(runs, timeFrame);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/api/workouts', {
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

  const fetchAllWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/api/workouts/all', {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        const workoutLogs = await response.json();
        setAllWorkouts(workoutLogs);
      } else {
        console.error('Failed to fetch workouts');
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  // Group workouts by date
  const groupWorkoutsByDate = (workouts) => {
    return workouts.reduce((acc, workout) => {
      const workoutDate = new Date(workout.date).toLocaleDateString(); // format to 'MM/DD/YYYY'
      if (!acc[workoutDate]) acc[workoutDate] = [];
      acc[workoutDate].push(workout);
      return acc;
    }, {});
  };

  useEffect(() => {
    fetchWorkouts();
    fetchAllWorkouts();
  }, []);

  useEffect(() => {
    if (allWorkouts.length > 0) {
      const exercises = [...new Set(allWorkouts.map((w) => w.exercise))];
      setExerciseOptions(exercises);
      if (exercises.length > 0) setSelectedExercise(exercises[0]);
  
      // Group workouts by date
      const groupedByDate = groupWorkoutsByDate(allWorkouts);
      setGroupedWorkouts2(groupedByDate);
      setSelectedDate(Object.keys(groupedByDate)[0] || '');
    }
  }, [allWorkouts]);
  

  const handleWorkoutSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/api/workouts/logworkout', {
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
      await fetchAllWorkouts();
      handleCloseModal();
    } catch (error) {
      console.error('Error logging workout:', error);
    }
  };

  const groupedWorkouts = workouts.reduce((acc, workout) => {
    const { exercise } = workout;
    if (!acc[exercise]) acc[exercise] = [];
    acc[exercise].push(workout);
    return acc;
  }, {});

  useEffect(() => {
    if (allWorkouts.length > 0) {
      const exercises = [...new Set(allWorkouts.map((w) => w.exercise))];
      setExerciseOptions(exercises);
      if (exercises.length > 0) setSelectedExercise(exercises[0]);
      setWeeklyConsistency(calculateWeeklyConsistency(allWorkouts));
      setWorkoutGaps(findWorkoutGaps(allWorkouts));
      setLongestStreak(calculateLongestStreak(allWorkouts));
      setConsistencyData(generateConsistencyData(allWorkouts, timeframe));
    }
  }, [allWorkouts, timeframe]);

  const filterWorkouts = (exercise, timeframeProgress) => {
    const filteredWorkouts = allWorkouts.filter((w) => w.exercise === exercise);
    let startDate = new Date();
    if (timeframeProgress === 'month') startDate.setMonth(startDate.getMonth() - 1);
    if (timeframeProgress === '3months') startDate.setMonth(startDate.getMonth() - 3);
    if (timeframeProgress === '6months') startDate.setMonth(startDate.getMonth() - 6);

    return filteredWorkouts.filter((w) => new Date(w.date) >= startDate);
  };

  // Inside the component

useEffect(() => {
  if (selectedExercise) {
    const filteredData = filterWorkouts(selectedExercise, timeframeProgress);
    if (filteredData.length === 0) {
      setChartData({ labels: [], datasets: [] });
      return;
    }

    // Calculate max reps for each weight
    const weightRepsMap = {};
    filteredData.forEach(({ weight, reps }) => {
      if (!weightRepsMap[weight] || reps > weightRepsMap[weight]) {
        weightRepsMap[weight] = reps;
      }
    });

    const weights = Object.keys(weightRepsMap).map(Number).sort((a, b) => a - b);
    const maxReps = weights.map((weight) => weightRepsMap[weight]);

    setChartData({
      labels: weights,
      datasets: [
        {
          label: 'Max Reps at Each Weight',
          data: maxReps,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          fill: false,
          pointRadius: 5,
        },
      ],
    });
  }
}, [selectedExercise, timeframeProgress]);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Weight (lbs)',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Max Reps',
      },
      beginAtZero: true,
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          const weight = tooltipItem.label;
          const reps = tooltipItem.raw;
          return `Weight: ${weight} lbs, Reps: ${reps}`;
        },
      },
    },
    title: {
      display: true,
      text: 'Max Reps at Each Weight',
    },
  },
};

  const calculateWeeklyConsistency = (workouts) => {
    if (workouts.length === 0) return 0;
  
    // Sort workouts by date to find the first and last workout dates
    const sortedWorkouts = workouts.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstWorkoutDate = new Date(sortedWorkouts[0].date);
    const lastWorkoutDate = new Date(sortedWorkouts[sortedWorkouts.length - 1].date);
  
    // Calculate the total number of weeks between the first and last workout dates
    const currentDate = new Date();
    const totalWeeks =
      Math.ceil((currentDate - firstWorkoutDate) / (1000 * 60 * 60 * 24 * 7));
  
    // Calculate the average workouts per week
    const totalWorkouts = workouts.length;
    return totalWeeks > 0 ? (totalWorkouts / totalWeeks).toFixed(2) : 0;
  };

  const findWorkoutGaps = (workouts) => {
    const sortedDates = workouts
      .map((workout) => new Date(workout.date))
      .sort((a, b) => a - b);

    let gaps = [];
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff > 7) {
        gaps.push({
          start: sortedDates[i - 1].toLocaleDateString(),
          end: sortedDates[i].toLocaleDateString(),
        });
      }
    }
    return gaps;
  };

  // Calculate the longest streak of consecutive weekly workouts
  const calculateLongestStreak = (workouts) => {
    const sortedDates = workouts
      .map((workout) => new Date(workout.date))
      .sort((a, b) => a - b);

    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const diff = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff <= 7) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return longestStreak;
  };
  
  const generateConsistencyData = (workouts, timeframe) => {
    if (workouts.length === 0) return { labels: [], datasets: [] };
  
    const sortedWorkouts = workouts.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  
    // Set start date based on selected timeframe
    let startDate;
    if (timeframe === 'week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    }
    const endDate = new Date();
  
    // Generate all dates in the range with formatted labels for MM/DD
    const allDates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
      allDates.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    // Mark days with workouts
    const workoutDates = new Set(workouts.map((w) => {
      const date = new Date(w.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }));
    
    const dataPoints = allDates.map((date) => (workoutDates.has(date) ? 1 : 0));
  
    return {
      labels: allDates,
      datasets: [
        {
          label: 'Workout Consistency',
          data: dataPoints,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderWidth: 1,
          pointRadius: 5,
          pointBackgroundColor: dataPoints.map((point) => (point === 1 ? 'rgba(75, 192, 192, 1)' : 'transparent')),
        },
      ],
    };
  };
  
  const consistencyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Workout Completed',
        },
        ticks: {
          beginAtZero: true,
          stepSize: 1,
          callback: (value) => (value === 1 ? 'Yes' : ''),
        },
      },
    },
  };

  const handleExport = async (type, format) => {
    if (!format) {
      alert(`Please select a format for ${type} export.`);
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/api/workouts/export?type=${type}&format=${format}`, {
        headers: {
          'x-auth-token': token,
        },
      });
  
      if (!response.ok) throw new Error('Failed to export');
  
      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', `${type}_summary.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Error exporting ${type} summary:`, error);
      alert(`Failed to export ${type} summary`);
    }
  };  

  return (
    <div
    style={{
      padding: '20px',
      textAlign: 'center',
    }}
  >
    <Box
            sx={{
              backgroundColor: '#f9f9f9',
              color: '#1aa64b',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '0 0 20px 20px',
              boxShadow: '0 4px 20px rgba(134, 220, 61, 0.15)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  fontFamily: 'Open Sans, sans-serif',
                  marginBottom: '0.5rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                Welcome!
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'normal',
                  fontFamily: 'Open Sans, sans-serif',
                  opacity: 0.9,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Browse Your Exercise Dashboard
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(134,220,61,0.1) 0%, rgba(249,249,249,0) 100%)',
                clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
                zIndex: 1,
              }}
            />
          </Box>

          <Box display="flex" justifyContent="center" mt={4}>
                <Button
                  variant={page === 'workout' ? 'contained' : 'outlined'}
                  onClick={() => setPage('workout')}
                  sx={{ borderRadius: '20px', mx: 1 }}
                >
                  Workouts
                </Button>
                <Button
                  variant={page === 'runs' ? 'contained' : 'outlined'}
                  onClick={() => setPage('runs')}
                  sx={{ borderRadius: '20px', mx: 1 }}
                >
                  Runs
                </Button>
              </Box>
    {/* Top row with Add Exercise and Export buttons */}
    {page === 'workout' && (
      <div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        padding: '10px 20px',
        borderRadius: '15px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)',
      }}
    >
      {/* Add Exercise Button */}
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
        onClick={handleOpenModal}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <AiOutlinePlus size={24} />
        <span style={{ marginLeft: '8px' }}>Add an Exercise</span>
      </button>
  
      {/* Export Options */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {/* Workout Export */}
        <div style={{ position: 'relative' }}>
          <button
            title="Export Workout"
            style={{
              backgroundColor: '#1aa64b',
              color: '#fff',
              padding: '10px 15px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            onClick={() => setIsWorkoutDropdownOpen(!isWorkoutDropdownOpen)}
          >
            Export Workout
          </button>
  
          {/* Workout Dropdown */}
          {isWorkoutDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                backgroundColor: '#fff',
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.15)',
                borderRadius: '10px',
                padding: '10px',
                zIndex: 10,
              }}
            >
              <label style={{ marginBottom: '5px', display: 'block' }}>
                Select Format
              </label>
              <select
                value={workoutFormat}
                onChange={(e) => setWorkoutFormat(e.target.value)}
                style={{ padding: '8px', width: '100%' }}
              >
                <option value="">-- Select Format --</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
  
              <button
                onClick={() => {
                  handleExport('workout', workoutFormat);
                  setIsWorkoutDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#1aa64b',
                  color: '#fff',
                  borderRadius: '5px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                Download
              </button>
            </div>
          )}
        </div>
  
        {/* Run Export */}
        <div style={{ position: 'relative' }}>
          <button
            title="Export Run"
            style={{
              backgroundColor: '#1aa64b',
              color: '#fff',
              padding: '10px 15px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            onClick={() => setIsRunDropdownOpen(!isRunDropdownOpen)}
          >
            Export Run
          </button>
  
          {/* Run Dropdown */}
          {isRunDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                backgroundColor: '#fff',
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.15)',
                borderRadius: '10px',
                padding: '10px',
                zIndex: 10,
              }}
            >
              <label style={{ marginBottom: '5px', display: 'block' }}>
                Select Format
              </label>
              <select
                value={runFormat}
                onChange={(e) => setRunFormat(e.target.value)}
                style={{ padding: '8px', width: '100%' }}
              >
                <option value="">-- Select Format --</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
  
              <button
                onClick={() => {
                  handleExport('run', runFormat);
                  setIsRunDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#1aa64b',
                  color: '#fff',
                  borderRadius: '5px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  
      {/* Today's Workout */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', padding: '20px', borderRadius: '15px', backgroundColor: '#f9f9f9', boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)', marginBottom: '20px' }}>
        {Object.keys(groupedWorkouts).length > 0 ? (
          Object.keys(groupedWorkouts).map((exerciseName) =>
            groupedWorkouts[exerciseName].map((log, index) => (
              <div key={`${exerciseName}-${index}`} style={{ backgroundColor: '#e0f7e0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', padding: '15px', width: 'calc(25% - 16px)', minWidth: '200px', transition: 'transform 0.2s ease', textAlign: 'center', margin: '10px 0' }} onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')} onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
                <h3 style={{ fontSize: '18px', color: '#2b2b2b', marginBottom: '8px', fontWeight: 'bold', textTransform: 'capitalize' }}>{exerciseName}</h3>
                <p><span style={{ fontWeight: 'bold', color: '#333' }}>Sets:</span> {log.sets}</p>
                <p><span style={{ fontWeight: 'bold', color: '#333' }}>Reps:</span> {log.reps}</p>
                <p><span style={{ fontWeight: 'bold', color: '#333' }}>Weight:</span> {log.weight} lbs</p>
              </div>
            ))
          )
        ) : (
          <p style={{ color: 'red', fontSize: '16px', textAlign: 'center' }}>No workout data available for today</p>
        )}
      </div>
  
      {/* Consistency and Progress Widgets */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Consistency Widget */}
        <div style={{ flex: '1', minWidth: '320px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '15px', boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)', marginBottom: '20px' }}>
          <h2 style={{ width: '100%', marginBottom: '15px' }}>Workout Consistency</h2>
          <p style={{ fontSize: '16px', color: '#333', textAlign: 'center' }}>Average Workouts per Week: {weeklyConsistency}</p>
          <p style={{ fontSize: '16px', color: '#333', textAlign: 'center' }}>Longest Streak (Weeks): {longestStreak}</p>
          {workoutGaps.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <h3 style={{ fontSize: '15px', color: '#333', marginBottom: '5px' }}>Workout Gaps:</h3>
              <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#666' }}>
                {workoutGaps.map((gap, index) => (
                  <li key={index}>{gap.start} - {gap.end}</li>
                ))}
              </ul>
            </div>
          )}
          <div style={{ marginTop: '15px', marginBottom: '15px', textAlign: 'center' }}>
            <label style={{ marginRight: '10px', fontSize: '16px' }}>Select Timeframe:</label>
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} style={{ padding: '6px', fontSize: '14px' }}>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '15px', boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)' }}>
            <Line data={consistencyData} options={consistencyOptions} />
          </div>
        </div>
  
        {/* Progress Widget */}
        <div style={{ flex: '1', minWidth: '320px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '15px', boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)', marginBottom: '20px' }}>
          <h2 style={{ width: '100%', marginBottom: '15px' }}>Workout Progress</h2>
          <div style={{ marginBottom: '15px', textAlign: 'center' }}>
            <label style={{ marginRight: '10px', fontSize: '16px' }}>Select Exercise:</label>
            <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)} style={{ padding: '6px', fontSize: '14px' }}>
              {exerciseOptions.map((exercise) => (
                <option key={exercise} value={exercise}>{exercise}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '15px', textAlign: 'center' }}>
            <label style={{ marginRight: '10px', fontSize: '16px' }}>Select Timeframe:</label>
            <select value={timeframeProgress} onChange={(e) => setTimeframeProgress(e.target.value)} style={{ padding: '6px', fontSize: '14px' }}>
              <option value="month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
            </select>
          </div>
          {chartData.labels.length > 0 ? (
            <div style={{ padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '15px' }}>
              <Line data={chartData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { display: true, text: 'Max Reps at Each Weight' },
                },
              }} />
            </div>
          ) : (
            <p style={{ color: '#666', fontSize: '14px', textAlign: 'center' }}>More data is needed for meaningful visualization.</p>
          )}
        </div>
      </div>
  
      {/* Workout History */}
      <div style={{padding: '20px', borderRadius: '15px', backgroundColor: '#f9f9f9', boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)', marginBottom: '20px', margin: 'auto' }}>
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', color: '#333' }}>Workout History</h2>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ fontSize: '16px', color: '#555', marginRight: '8px' }}>Select Date:</label>
            <select onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate} style={{ padding: '8px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}>
              {Object.keys(groupedWorkouts2).map((date) => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards Row or No Data Message */}
        {selectedDate && groupedWorkouts2[selectedDate]?.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            {groupedWorkouts2[selectedDate].map((log, index) => (
              <div key={index} style={{ backgroundColor: '#e0f7e0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', padding: '15px', width: 'calc(25% - 16px)', minWidth: '200px', transition: 'transform 0.2s ease', textAlign: 'center' }} onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')} onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
                <p style={{ fontWeight: 'bold', fontSize: '18px', color: '#2b2b2b', marginBottom: '8px' }}>{log.exercise}</p>
                <p><span style={{ fontWeight: 'bold', color: '#333' }}>Sets:</span> {log.sets}</p>
                <p><span style={{ fontWeight: 'bold', color: '#333' }}>Reps:</span> {log.reps}</p>
                <p><span style={{ fontWeight: 'bold', color: '#333' }}>Weight:</span> {log.weight} lbs</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'red', fontSize: '16px', textAlign: 'center' }}>No workout data available for the selected date</p>
        )}
      </div>
      </div>
    )}

{page === 'runs' && (
        <div>
          <div className={`tracker-page ${darkMode ? 'dark-mode' : ''}`}>
      {/* Date and Add Run Button */}
      <div className="header-section">
        <h2 className="current-date">{new Date().toLocaleDateString()}</h2>
        <button
          title="Add New"
          onClick={() => setIsFormOpen(true)}
          className="add-run-button"
        >
          <AiOutlinePlus size={24} />
          <span>Add a run</span>
        </button>
      </div>

      {/* Graph Container */}
      <div className="graph-container">
        {/* Time Frame Selector */}
        <div className="time-frame-selector">
          <label htmlFor="timeFrame">Select Time Frame:</label>
          <select
            id="timeFrame"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Graphs Section */}
        <div className="graphs-section">
          <div className="graph">
            <RunDistanceChart runs={filteredRuns} darkMode={darkMode} />
          </div>
          <div className="graph">
            <SpeedGraph runs={filteredRuns} darkMode={darkMode} />
          </div>
        </div>
      </div>

      {/* Run Logs Table */}
      <div className="run-logs-section">
        <h2>Run Logs</h2>

        {isLoading ? (
          <p>Loading runs...</p>
        ) : fetchError ? (
          <p className="error-message">{fetchError}</p>
        ) : (
          <table className="run-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Duration (min)</th>
                <th>Distance (km)</th>
              </tr>
            </thead>
            <tbody>
              {runs.length > 0 ? (
                runs.map((run) => (
                  <tr
                    key={run._id}
                    className="run-row"
                    onClick={() => {
                      setCurrentRun(run);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <td>{new Date(run.date).toLocaleDateString()}</td>
                    <td>{run.duration}</td>
                    <td>{run.distance}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    No runs logged yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      <RunLogForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={logRun}
        darkMode={darkMode}
      />
      <EditRunModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={editRun}
        onDelete={deleteRun}
        run={currentRun}
      />
      <ConfirmDeleteRunModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteRun(currentRun._id)}
      />
    </div>
        </div>
      )}
        
      {/* Modal for adding workouts */}
      <WorkoutLogForm isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleWorkoutSubmit} />
    </div>
  );
};

export default Workout;
