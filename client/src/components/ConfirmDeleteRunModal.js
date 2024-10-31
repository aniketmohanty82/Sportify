import React from 'react';
import '../MealLogForm.css'; 


const ConfirmDeleteRunModal = ({ isOpen, onClose, onConfirm }) => {
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="title">Confirm Deletion</h2>
        <p>Are you sure you want to delete this run?</p>
        <div className="button-group">
          <button onClick={onConfirm} className="btn">Yes, Delete</button>
          <button onClick={onClose} className="btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteRunModal;
