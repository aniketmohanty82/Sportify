/*client/src/components/WorkoutPlanCard.js*/

import React from 'react';
import '../WorkoutPlanCardStyles.css'; // Import component-specific styles

const WorkoutPlanCard = ({ plan, onClick }) => {
  return (
    <div className="exercise-card" onClick={onClick}>
      <h3>{plan.name}</h3>
      <p>{plan.description}</p>
      <small>Duration: {plan.duration} mins</small>
    </div>
  );
};

export default WorkoutPlanCard;
