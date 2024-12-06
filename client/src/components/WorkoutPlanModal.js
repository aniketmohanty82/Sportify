import React from "react";
import { FaRunning, FaDumbbell, FaStopwatch } from "react-icons/fa"; // Icons
import "../WorkoutPlanModalStyles.css";

const WorkoutPlanModal = ({ plan, source = "predefined", onClose }) => {
    if (!plan) return null;
  
    const { name, description, exercises } = plan;
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Header Section */}
          <div className="modal-header">
            <h2 className="title">{name || "Workout Plan"}</h2>
          </div>
  
          {/* Description */}
          <div className="description-section">
            <p>
              <strong>Overview:</strong>
            </p>
            {description.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
  
          {/* Exercises Section */}
          <div className="exercises-section">
            <h3>Exercises:</h3>
            <ul className="exercise-list">
              {source === "predefined" && (!exercises || exercises.length === 0) && (
                <p>No exercises listed for this plan.</p>
              )}
  
              {source === "ai" && (!exercises || exercises.length === 0) && (
                <p>No AI-generated exercises available.</p>
              )}
  
              {exercises && exercises.length > 0 ? (
                exercises.map((exercise, index) => (
                  <li key={index} className="exercise-item">
                    <strong>{exercise.name || "Unnamed Exercise"}</strong>{" "}
                    {exercise.focus && (
                      <span style={{ color: "#16a085" }}>({exercise.focus})</span>
                    )}{" "}
                    {exercise.duration && (
                      <span style={{ fontWeight: "bold" }}>
                        ⏱ {exercise.duration} mins
                      </span>
                    )}
                  </li>
                ))
              ) : null}
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
