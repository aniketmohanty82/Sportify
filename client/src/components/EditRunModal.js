import React, { useState, useEffect } from 'react';
import '../RunLogForm.css';
import ConfirmDeleteRunModal from '../components/ConfirmDeleteRunModal';

const EditRunModal = ({ isOpen, onClose, run, onSubmit, onDelete }) => {
  const [formData, setFormData] = useState({ date: '', duration: '', distance: '' });
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false); // Control for delete confirmation modal

  useEffect(() => {
    if (run) {
      setFormData({
        date: new Date(run.date).toISOString().split('T')[0],
        duration: run.duration,
        distance: run.distance,
      });
    }
  }, [run]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, _id: run._id });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="title">Edit Run</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="input"
              disabled
            />
          </div>
          <div className="form-field">
            <label htmlFor="duration">Duration (minutes):</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Duration"
              min="1"
              required
              className="input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="distance">Distance (km):</label>
            <input
              type="number"
              id="distance"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              placeholder="Distance"
              step="0.1"
              min="0.1"
              required
              className="input"
            />
          </div>
          <button type="submit" className="btn">Save Changes</button>
          <button type="button" onClick={onClose} className="btn">Cancel</button>
          <button
            type="button"
            onClick={() => setIsConfirmDeleteOpen(true)} // Open the confirm delete modal
            className="btn"
          >
            Delete Run
          </button>
        </form>

        <ConfirmDeleteRunModal
          isOpen={isConfirmDeleteOpen}
          onClose={() => setIsConfirmDeleteOpen(false)}
          onConfirm={() => {
            if (typeof onDelete === 'function') {
              onDelete(run._id); // Calls delete function if it’s defined correctly
              setIsConfirmDeleteOpen(false);
              onClose(); // Close edit modal after deletion
            } else {
              console.error("onDelete is not a function");
            }
          }}
        />
      </div>
    </div>
  );
};

export default EditRunModal;
