import React, { useState, useEffect } from 'react';
import { useForm } from 'react-cool-form';
import '../MealLogForm.css'; // Import the CSS file for styling

const Field = ({ label, id, ...rest }) => (
  <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} className="input" {...rest} />
  </div>
);

const WorkoutLogForm = ({ onSubmit, isOpen, onClose, onError }) => {
  const { form, reset } = useForm({
    defaultValues: {
      exercise: '',
      sets: '',
      reps: '',
    },
    onSubmit: async (values) => {
      const { exercise, sets, reps } = values;
    
      if (!exercise) {
        alert('Please enter an exercise.');
        return;
      }
    
      if (Number(sets) <= 0) { // Ensure sets is a number
        alert('Please enter a valid number of sets.');
        return;
      }
    
      if (Number(reps) <= 0) { // Ensure reps is a number
        alert('Please enter a valid number of reps.');
        return;
      }
    
      try {
        console.log('Form data prepared for submission:', {
          userId: localStorage.getItem('userId'),
          exercise,
          sets: Number(sets),
          reps: Number(reps),
          date: new Date(),
        });
        // Submit the form data to the backend or handle it appropriately
        onSubmit({
          userId: localStorage.getItem('userId'),
          exercise,
          sets: Number(sets), // Convert sets to a number
          reps: Number(reps), // Convert reps to a number
          date: new Date(), // Add the current date
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
            min="1" // Prevent negative values
            placeholder="Enter number of sets..."
          />
          <Field
            label="Reps"
            id="reps"
            name="reps"
            type="number"
            min="1" // Prevent negative values
            placeholder="Enter number of reps..."
          />
          <button type="submit" className="btn">Log Workout</button>
        </form>
      </div>
    </div>
  );
};

export default WorkoutLogForm;
