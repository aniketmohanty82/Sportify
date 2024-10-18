import React, { useState, useEffect } from 'react';
import WorkoutLogForm from '../components/WorkoutLogForm';
import '../WorkoutPage.css';
import { AiOutlinePlus } from 'react-icons/ai';

const Workout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState([]);

  // Dummy workout data
  const dummyWorkouts = [
    { exercise: 'Bench Press', sets: 3, reps: 10 },
    { exercise: 'Squats', sets: 4, reps: 12 },
    { exercise: 'Deadlifts', sets: 3, reps: 8 },
  ];

  useEffect(() => {
    // Set dummy workouts when the component mounts
    setWorkouts(dummyWorkouts);
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  

//   //   const handleFormSubmit = async (data) => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await fetch('http://localhost:5001/api/workouts/logworkout', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'x-auth-token': token,
// //         },
// //         body: JSON.stringify({ exercises: data }),
// //       });

//   // Uncomment when ready to use API
//   // const fetchWorkouts = async () => {
//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     const response = await fetch('http://localhost:5001/api/workouts', {
//   //       method: 'GET',
//   //       headers: {
//   //         'x-auth-token': token,
//   //       },
//   //     });

//   //     if (response.ok) {
//   //       const workoutLogs = await response.json();
//   //       setWorkouts(workoutLogs);
//   //     } else {
//   //       console.error('Failed to fetch workouts');
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching workouts:', error);
//   //   }
//   // };

//   // Uncomment when ready to use API
//   // useEffect(() => {
//   //   fetchWorkouts();
//   // }, []);

  const handleWorkoutSubmit = async (data) => {
    console.log('Workout logged:', data);
    
    // Add the new workout data to the workouts state
    setWorkouts((prevWorkouts) => [
      ...prevWorkouts,
      ...data.exercises, // Assuming data.exercises is an array of workout objects
    ]);
    
    handleCloseModal(); // Close the workout log modal
  };

  const calculateTotalVolume = () => {
    return workouts.reduce((total, workout) => total + (workout.sets * workout.reps), 0);
  };

  return (
    <div className="workout-page">
      {/* Top row with date and add button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px', 
        padding: '10px 20px', 
        borderRadius: '15px', 
        backgroundColor: '#f9f9f9', 
        boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)',
      }}>
        {/* Current Date Display */}
        <h2 style={{ 
          fontSize: '24px', 
          color: '#333', 
          fontFamily: 'Open Sans, sans-serif',
        }}>
          {new Date().toLocaleDateString()}
        </h2>

        {/* Add New Workout Button */}
        <button
          title="Add New"
          className="group flex items-center cursor-pointer outline-none hover:shadow-lg duration-300 transition-transform transform hover:scale-105"
          onClick={handleOpenModal}
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
          <AiOutlinePlus size={24} />
          <span style={{ marginLeft: '8px' }}>Add a workout</span>
        </button>
      </div>

      {/* Workout Volume Tracking Section */}
      <div style={{ 
        padding: '20px', 
        borderRadius: '15px', 
        backgroundColor: '#f9f9f9', 
        boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)',
        marginBottom: '20px',
      }}>
        <h2 style={{ marginBottom: '15px' }}>Workout Volume Tracking</h2>
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#333' }}>
          Total Volume: {calculateTotalVolume()} reps
        </p>
      </div>

      {/* Workout Log Table */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: '20px', 
        borderRadius: '15px', 
        backgroundColor: '#f9f9f9', 
        boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)',
      }}>
        <h2 style={{ width: '100%', marginBottom: '15px' }}>Workout Logs</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Exercise</th>
              <th>Sets</th>
              <th>Reps</th>
            </tr>
          </thead>
          <tbody>
            {workouts.length > 0 ? (
              workouts.map((log, index) => (
                <tr key={index}>
                  <td>{log.exercise}</td>
                  <td>{log.sets}</td>
                  <td>{log.reps}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No workouts logged</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals for adding workouts */}
      <WorkoutLogForm isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleWorkoutSubmit} />
    </div>
  );
};

export default Workout;
