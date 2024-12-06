import React, { useState } from 'react';
import WorkoutPlanCard from '../components/WorkoutPlanCard';
import WorkoutPlanModal from '../components/WorkoutPlanModal';
import '../WorkoutPlansStyles.css'; // Import CSS

const workoutPlansData = [
  // Soccer Plans
  {
    name: "Soccer Endurance Plan",
    sport: "soccer",
    description: "Improve your endurance, agility, and soccer skills.",
    duration: 60,
    exercises: [
      { name: "Cone Dribbling", focus: "Agility", duration: 10 },
      { name: "Sprint Intervals", focus: "Cardio", duration: 15 },
      { name: "Resistance Band Side Steps", focus: "Strength", duration: 10 },
      { name: "Passing Drills", focus: "Technique", duration: 15 },
      { name: "Cooldown Stretch", focus: "Flexibility", duration: 10 },
    ],
  },
  {
    name: "Soccer Skills Booster",
    sport: "soccer",
    description: "Hone your soccer technique with targeted drills.",
    duration: 50,
    exercises: [
      { name: "Shooting Drills", focus: "Technique", duration: 15 },
      { name: "Ball Control Exercises", focus: "Agility", duration: 15 },
      { name: "Endurance Run", focus: "Cardio", duration: 10 },
      { name: "Cool Down", focus: "Flexibility", duration: 10 },
    ],
  },

  // Basketball Plans
  {
    name: "Basketball Shooting Plan",
    sport: "basketball",
    description: "Sharpen your shooting skills and cardio fitness.",
    duration: 45,
    exercises: [
      { name: "3-Point Shooting Drills", focus: "Shooting", duration: 15 },
      { name: "Resistance Band Lunges", focus: "Strength", duration: 10 },
      { name: "Shuttle Runs", focus: "Cardio", duration: 10 },
      { name: "Stretching", focus: "Flexibility", duration: 10 },
    ],
  },
  {
    name: "Basketball Speed Plan",
    sport: "basketball",
    description: "Boost your speed and footwork on the court.",
    duration: 60,
    exercises: [
      { name: "Ladder Drills", focus: "Speed", duration: 10 },
      { name: "Suicides", focus: "Cardio", duration: 20 },
      { name: "Plyometric Jumps", focus: "Strength", duration: 15 },
      { name: "Stretching", focus: "Flexibility", duration: 15 },
    ],
  },

  // Running Plans
  {
    name: "Running Strength Plan",
    sport: "running",
    description: "Build strength and endurance for long-distance running.",
    duration: 50,
    exercises: [
      { name: "Hill Repeats", focus: "Cardio", duration: 15 },
      { name: "Bodyweight Lunges", focus: "Strength", duration: 10 },
      { name: "Core Stability Exercises", focus: "Core Strength", duration: 10 },
      { name: "Cooldown Stretch", focus: "Flexibility", duration: 15 },
    ],
  },
  {
    name: "5K Beginner Plan",
    sport: "running",
    description: "Start your running journey with this beginner-friendly plan.",
    duration: 30,
    exercises: [
      { name: "Brisk Walk", focus: "Warm-Up", duration: 10 },
      { name: "Easy Jog", focus: "Cardio", duration: 15 },
      { name: "Stretch", focus: "Flexibility", duration: 5 },
    ],
  },

  // Tennis Plans
  {
    name: "Tennis Agility Plan",
    sport: "tennis",
    description: "Enhance your agility and court movement.",
    duration: 40,
    exercises: [
      { name: "Lateral Court Sprints", focus: "Agility", duration: 15 },
      { name: "Shadow Tennis", focus: "Technique", duration: 10 },
      { name: "Core Strength Drills", focus: "Strength", duration: 10 },
      { name: "Stretching", focus: "Flexibility", duration: 5 },
    ],
  },
  {
    name: "Tennis Power Plan",
    sport: "tennis",
    description: "Increase your serving power and explosiveness.",
    duration: 45,
    exercises: [
      { name: "Medicine Ball Slams", focus: "Power", duration: 15 },
      { name: "Resistance Band Rows", focus: "Strength", duration: 10 },
      { name: "Sprint Intervals", focus: "Cardio", duration: 10 },
      { name: "Cool Down", focus: "Flexibility", duration: 10 },
    ],
  },

  // Swimming Plans
  {
    name: "Swimming Endurance Plan",
    sport: "swimming",
    description: "Improve your swimming endurance and speed.",
    duration: 60,
    exercises: [
      { name: "Freestyle Laps", focus: "Cardio", duration: 20 },
      { name: "Kickboard Drills", focus: "Leg Strength", duration: 15 },
      { name: "Breathing Drills", focus: "Technique", duration: 10 },
      { name: "Cooldown Swim", focus: "Recovery", duration: 15 },
    ],
  },
  {
    name: "Swimming Strength Plan",
    sport: "swimming",
    description: "Build swimming-specific strength.",
    duration: 45,
    exercises: [
      { name: "Pull Buoy Laps", focus: "Upper Body Strength", duration: 20 },
      { name: "Underwater Kick", focus: "Core Strength", duration: 10 },
      { name: "Stretching", focus: "Flexibility", duration: 15 },
    ],
  },

  // Cycling Plans
  {
    name: "Cycling Endurance Plan",
    sport: "cycling",
    description: "Train for long-distance cycling.",
    duration: 75,
    exercises: [
      { name: "Steady-State Ride", focus: "Cardio", duration: 50 },
      { name: "Hill Climbs", focus: "Strength", duration: 15 },
      { name: "Cooldown Ride", focus: "Recovery", duration: 10 },
    ],
  },
  {
    name: "Cycling Speed Plan",
    sport: "cycling",
    description: "Increase your cycling speed and power.",
    duration: 60,
    exercises: [
      { name: "Sprint Intervals", focus: "Cardio", duration: 20 },
      { name: "High Cadence Spinning", focus: "Speed", duration: 20 },
      { name: "Cooldown", focus: "Recovery", duration: 20 },
    ],
  },
];

const WorkoutPlans = () => {
  const [sport, setSport] = useState(''); // Selected sport
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [aiWorkoutInput, setAiWorkoutInput] = useState('');
  const [aiWorkoutPlan, setAiWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAIWorkoutSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/api/ai/workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiWorkoutInput }),
      });
      const data = await response.json();
      setAiWorkoutPlan(data); // Set the generated workout plan
    } catch (error) {
      console.error('Error fetching AI workout:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = workoutPlansData.filter(
    (plan) => plan.sport === sport.toLowerCase()
  );

  const handlePlanClick = (plan) => setSelectedPlan(plan);

  return (
    <div className="workout-plans-container">
      <h1 className="title">Workout Plans</h1>
  
      {/* Sports Plans Section */}
      <div className="sports-plans-section grey-box">
        <h2 className="section-title">Explore Predefined Workout Plans</h2>
        <div className="form-field">
          <label htmlFor="sport-select" className="dropdown-label">
            Select a Sport:
          </label>
          <select
            id="sport-select"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="select"
          >
            <option value="">--Choose--</option>
            <option value="basketball">Basketball</option>
            <option value="soccer">Soccer</option>
            <option value="running">Running</option>
            <option value="tennis">Tennis</option>
            <option value="swimming">Swimming</option>
            <option value="cycling">Cycling</option>
          </select>
        </div>
  
        <div className="exercise-grid">
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan, index) => (
              <WorkoutPlanCard
                key={index}
                plan={plan}
                onClick={() => handlePlanClick(plan)}
              />
            ))
          ) : (
            sport && (
              <p className="no-plans-message">
                No plans available for this sport. Check back later!
              </p>
            )
          )}
        </div>
      </div>
  
      {/* AI Workout Section */}
      <div className="ai-workout-section grey-box">
        <h2 className="section-title">Ask AI for a Custom Workout</h2>
        <input
          type="text"
          placeholder="Describe your workout needs (e.g., 30 minutes, no equipment, soccer)"
          value={aiWorkoutInput}
          onChange={(e) => setAiWorkoutInput(e.target.value)}
          className="ai-input"
        />
        <button
          onClick={handleAIWorkoutSubmit}
          className="btn"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Workout'}
        </button>
      </div>
  
      {/* Display AI-Generated Workout */}
      {aiWorkoutPlan && (
        <WorkoutPlanModal
          plan={aiWorkoutPlan}
          onClose={() => setAiWorkoutPlan(null)}
        />
      )}
  
      {selectedPlan && (
        <WorkoutPlanModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );  
};

export default WorkoutPlans;
