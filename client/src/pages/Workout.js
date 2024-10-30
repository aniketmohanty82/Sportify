import React, { useState, useEffect } from 'react';
import WorkoutLogForm from '../components/WorkoutLogForm';
import '../WorkoutPage.css';
import { AiOutlinePlus } from 'react-icons/ai';

const Workout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState([]);

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

  useEffect(() => {
    fetchWorkouts();
  }, []);

const handleWorkoutSubmit = async (data) => {
  console.log('Workout logged:', data);

  try {
    const token = localStorage.getItem('token');
    console.log(token)
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
    await fetchWorkouts()
    handleCloseModal();
    
  } catch (error) {
    console.error('Error logging workout:', error);
    // Optionally show an error message to the user here
  }
};

  const calculateTotalVolume = () => {
    return workouts.reduce((total, workout) => total + (workout.sets * workout.reps), 0);
  };
 // Group workouts by exercise name for dynamic headers
 const groupedWorkouts = workouts.reduce((acc, workout) => {
  const { exercise } = workout;
  if (!acc[exercise]) acc[exercise] = [];
  acc[exercise].push(workout);
  return acc;
}, {});

return (
  <div className="workout-page">
    {/* Top row with date and add button */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '10px 20px', borderRadius: '15px', backgroundColor: '#f9f9f9', boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)' }}>
      <h2 style={{ fontSize: '24px', color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
        {new Date().toLocaleDateString()}
      </h2>
      <button title="Add New" className="group flex items-center cursor-pointer outline-none hover:shadow-lg duration-300 transition-transform transform hover:scale-105" onClick={handleOpenModal} style={{ backgroundColor: '#1aa64b', color: '#fff', padding: '10px 15px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: 'bold' }}>
        <AiOutlinePlus size={24} />
        <span style={{ marginLeft: '8px' }}>Add a workout</span>
      </button>
    </div>

    {/* Workout Volume Tracking Section */}
    <div style={{ padding: '20px', borderRadius: '15px', backgroundColor: '#f9f9f9', boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)', marginBottom: '20px' }}>
      <h2 style={{ marginBottom: '15px' }}>Workout Volume Tracking</h2>
      <p style={{ textAlign: 'center', fontSize: '18px', color: '#333' }}>
        Total Volume: {calculateTotalVolume()} reps
      </p>
    </div>

    {/* Dynamic Workout Logs Section */}
    <div className="workout-logs-container">
      <h2 style={{ width: '100%', marginBottom: '15px' }}>Workout Logs</h2>
      {Object.keys(groupedWorkouts).length > 0 ? (
        Object.keys(groupedWorkouts).map((exerciseName) => (
          <div className="workout-category" key={exerciseName} style={{ width: '24%', marginBottom: '20px' }}>
            <h3 className="workout-header" style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>{exerciseName}</h3>
            <table className="workout-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <tbody>
                {groupedWorkouts[exerciseName].map((log, index) => (
                  <tr key={index}>
                    <td>Sets: {log.sets}</td>
                    <td>Reps: {log.reps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No workouts logged</p>
      )}
    </div>

    {/* Modal for adding workouts */}
    <WorkoutLogForm isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleWorkoutSubmit} />
  </div>
);
};

export default Workout;
