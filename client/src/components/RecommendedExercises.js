import React, { useState } from 'react';

const RecommendedExercises = ({ totalCalories, dailyCalorieGoal, exercises }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('beginner'); // Default level

  // Calculate excess calories
  const calorieExcess = totalCalories - dailyCalorieGoal;

  // Filter exercises based on selected fitness level and calorie excess
  const suggestedExercises = exercises
    .filter((exercise) => exercise.fitnessLevel.includes(selectedLevel)) // Updated to match fitnessLevel with selectedLevel
    .map((exercise) => ({
      ...exercise,
      recommendedMinutes: Math.ceil(calorieExcess / exercise.calories_per_minute),
    }))
    .slice(0, 3); // Limit to 3 exercises

  // Toggle the expansion of the list
  const toggleExpand = () => setIsExpanded(!isExpanded);

  if (totalCalories <= dailyCalorieGoal) {
    return null; // Return nothing if the calorie intake does not exceed the goal
  }

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      padding: '15px',
      borderRadius: '10px',
      margin: '20px 0',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'relative',
    }}>
      <h3 style={{ fontSize: '18px', color: '#333' }}>Suggested Exercises</h3>
      <p style={{ color: '#666', fontSize: '14px' }}>
        You have exceeded your daily calorie goal by {calorieExcess} calories. Try these exercises to help balance it out.
      </p>

      {/* Dropdown for selecting fitness level */}
      <label htmlFor="fitnessLevel" style={{ fontSize: '14px', marginRight: '8px' }}>Select Fitness Level:</label>
      <select
        id="fitnessLevel"
        value={selectedLevel}
        onChange={(e) => setSelectedLevel(e.target.value)}
        style={{ padding: '5px', borderRadius: '5px', marginBottom: '10px' }}
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      {/* Expandable List */}
      <div style={{ display: isExpanded ? 'block' : 'none', marginTop: '10px' }}>
        {suggestedExercises.map((exercise, index) => (
          <div key={index} style={{
            padding: '10px',
            marginBottom: '8px',
            backgroundColor: '#e0f7e0',
            borderRadius: '5px',
          }}>
            <h4 style={{ marginBottom: '5px', fontSize: '16px', color: '#333' }}>{exercise.name}</h4>
            <p style={{ margin: '0', color: '#555', fontSize: '14px' }}>
              <strong>Calories Burned per Minute:</strong> {exercise.calories_per_minute}
            </p>
            <p style={{ margin: '0', color: '#555', fontSize: '14px' }}>{exercise.description}</p>
            <p style={{ margin: '0', color: '#555', fontSize: '14px' }}>
              <strong>Recommended Duration:</strong> {exercise.recommendedMinutes} minutes
            </p>
          </div>
        ))}
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleExpand}
        style={{
          backgroundColor: '#1aa64b',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        {isExpanded ? 'Hide Exercises' : 'Show Exercises'}
      </button>
    </div>
  );
};

export default RecommendedExercises;
