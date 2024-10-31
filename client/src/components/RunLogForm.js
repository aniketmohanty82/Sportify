import React, { useState, useEffect } from 'react';
import { useForm } from 'react-cool-form';
import '../RunLogStyles.css';

const Field = ({ label, id, ...rest }) => (
  <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} className="input" {...rest} />
  </div>
);

const RunLogForm = ({ onSubmit, isOpen, onClose, onError }) => {
  const { form, reset } = useForm({
    defaultValues: {
      duration: '',
      distance: '',
      date: '',  // Ensure that this matches the `name` attribute in Field component
    },
    onSubmit: async (values) => {
      const { duration, distance, date } = values;
      if (Number(duration) <= 0 || Number(distance) <= 0) {
        alert('Please enter valid values for duration and distance.'); // TODO - change to make ir the custom red ones
        return;
      }

      onSubmit({
        userId: localStorage.getItem('userId'),
        duration: Number(duration),
        distance: Number(distance),
        date: new Date(date), // Use the date provided in the form
      });
      reset();
      onClose();
    },
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="title">Log Your Run</h2>
        <form ref={form}>
          <Field label="Date" id="date" name="date" type="date" placeholder="Select date" />
          <Field label="Duration (minutes)" id="duration" name="duration" type="number" min="1" placeholder="Duration in minutes" />
          <Field label="Distance (km)" id="distance" name="distance" type="number" step="0.1" min="0.1" placeholder="Distance in km" />
          <button type="submit" className="btn">Log Run</button>
        </form>
      </div>
    </div>
  );
};

export default RunLogForm;
