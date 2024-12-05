import React from "react";
import { FaRunning, FaDumbbell, FaStopwatch } from "react-icons/fa"; // Icons
import "../WorkoutPlanModalStyles.css";

const WorkoutPlanModal = ({ plan, onClose }) => {
  if (!plan) return null;

  const { name, description, exercises } = plan;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header Section */}
        <div className="modal-header">
          <h2 className="title">
            {name || "AI-Generated Workout"}
          </h2>
        </div>

        {/* Description */}
        <div className="description-section">
          <p>
            <FaStopwatch style={{ marginRight: "5px", color: "#1aa64b" }} />
            <strong>Overview:</strong>
          </p>
          <p>{description || "No description available."}</p>
        </div>

        {/* Exercises Section */}
        <div className="exercises-section">
          <h3>
            <FaDumbbell style={{ marginRight: "5px", color: "#1aa64b" }} />
            Exercises:
          </h3>
          <ul className="exercise-list">
            {Array.isArray(exercises) && exercises.length > 0 ? (
              exercises.map((exercise, index) => (
                <li key={index} className="exercise-item">
                  <strong>{exercise.name || "Unnamed Exercise"}</strong>{" "}
                  <span style={{ color: "#16a085" }}>({exercise.focus})</span>{" "}
                  <span style={{ fontWeight: "bold" }}>
                    ⏱ {exercise.duration || "Unknown"} mins
                  </span>
                </li>
              ))
            ) : (
              <p>No exercises available for this plan.</p>
            )}
          </ul>
        </div>

        {/* Footer Section */}
        <div className="modal-footer">
          <button className="btn btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanModal;
