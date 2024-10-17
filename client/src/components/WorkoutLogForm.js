import React, { useState, useEffect } from 'react';
import { useForm } from 'react-cool-form';
import '../MealLogForm.css'; // Import the CSS file for styling

const Field = ({ label, id, ...rest }) => (
  <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} className="input" {...rest} />
  </div>
);

const Select = ({ label, id, children, ...rest }) => (
  <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <select id={id} className="select" {...rest}>
      {children}
    </select>
  </div>
);

const WorkoutLogForm = ({ onSubmit, isOpen, onClose, onError }) => {
  const { form, reset } = useForm({
    defaultValues: {
      exercise: '',
      sets: '',
      reps: '',
      workoutCategory: '',
    },
    onSubmit: async (values) => {
      const { exercise, sets, reps, workoutCategory } = values;

      if (!exercise) {
        alert('Please enter an exercise.');
        return;
      }

      if (sets <= 0) {
        alert('Please enter the number of sets.');
        return;
      }

      if (reps <= 0) {
        alert('Please enter the number of reps.');
        return;
      }

      if (!workoutCategory) {
        alert('Please choose the workout category.');
        return;
      }

      try {
        // Submit the form data to the backend or handle it appropriately
        onSubmit({
          userId: localStorage.getItem('userId'),
          exercise,
          sets,
          reps,
          workoutCategory,
          date: new Date(),
        });

        // Clear the form after submission
        reset();
        onClose(); // Close the modal after submission
      } catch (error) {
        console.error('Error submitting workout log:', error);
        onError();
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      // Reset the component state when closed
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null; // Render nothing if the modal is not open

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="title">Log Your Workout</h2>
        <form ref={form}>
          <Field
            label="Exercise"
            id="exercise"
            name="exercise"
            placeholder="Enter exercise name..."
          />
          <Field
            label="Sets"
            id="sets"
            name="sets"
            type="number"
            min="1" // Prevents negative values
            placeholder="Enter number of sets..."
          />
          <Field
            label="Reps"
            id="reps"
            name="reps"
            type="number"
            min="1" // Prevents negative values
            placeholder="Enter number of reps..."
          />
          <Select label="Workout Category" id="workoutCategory" name="workoutCategory">
            <option value="">Select Workout Category</option>
            <option value="Strength Training">Strength Training</option>
            <option value="Cardio">Cardio</option>
            <option value="Flexibility">Flexibility</option>
            <option value="Balance">Balance</option>
          </Select>
          <button type="submit" className="btn">Log Workout</button>
        </form>
      </div>
    </div>
  );
};

export default WorkoutLogForm;
