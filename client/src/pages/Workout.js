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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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

  const fetchAllWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/workouts/all', {
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

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* Top row with date and add button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '10px 20px', borderRadius: '15px', backgroundColor: '#f9f9f9', boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)' }}>
        <h2 style={{ fontSize: '24px', color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
          {new Date().toLocaleDateString()}
        </h2>
        <button title="Add New" style={{ backgroundColor: '#1aa64b', color: '#fff', padding: '10px 15px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'transform 0.2s ease' }} onClick={handleOpenModal} onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
          <AiOutlinePlus size={24} />
          <span style={{ marginLeft: '8px' }}>Add an exercise</span>
        </button>
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
          {/* {workoutGaps.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <h3 style={{ fontSize: '15px', color: '#333', marginBottom: '5px' }}>Workout Gaps:</h3>
              <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#666' }}>
                {workoutGaps.map((gap, index) => (
                  <li key={index}>{gap.start} - {gap.end}</li>
                ))}
              </ul>
            </div>
          )} */}
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
  
      {/* Modal for adding workouts */}
      <WorkoutLogForm isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleWorkoutSubmit} />
    </div>
  );
};

export default Workout;
