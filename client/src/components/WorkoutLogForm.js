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
      weight: '',
    },
    onSubmit: async (values) => {
      const { exercise, sets, reps, weight } = values;
    
      if (!exercise) {
        alert('Please enter an exercise.');
        return;
      }
    
      if (Number(sets) <= 0) { 
        alert('Please enter a valid number of sets.');
        return;
      }
    
      if (Number(reps) <= 0) { 
        alert('Please enter a valid number of reps.');
        return;
      }

      if (Number(weight) <= 0) { 
        alert('Please enter a valid weight.');
        return;
      }
    
      try {
        onSubmit({
          userId: localStorage.getItem('userId'),
          exercise,
          sets: Number(sets),
          reps: Number(reps),
          weight,
          date: new Date(),
        });
    
        reset();
        onClose();
      } catch (error) {
        console.error('Error submitting workout log:', error);
        onError();
      }
    },    
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

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
            min="1"
            placeholder="Enter number of sets..."
          />
          <Field
            label="Reps"
            id="reps"
            name="reps"
            type="number"
            min="1"
            placeholder="Enter number of reps..."
          />
          <Field
            label="Weight (lbs)"
            id="weight"
            name="weight"
            type="number"
            min="1"
            placeholder="Enter weight..."
          />

          <button type="submit" className="btn">Log Exercise</button>
        </form>
      </div>
    </div>
  );
};

export default WorkoutLogForm;
