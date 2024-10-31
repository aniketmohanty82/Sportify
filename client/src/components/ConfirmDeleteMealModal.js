import React from 'react';

const ConfirmDeleteMealModal = ({ isOpen, onClose, onConfirm, mealName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete the meal: <strong>{mealName}</strong>?</p>
        <button onClick={onConfirm}>Yes, Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmDeleteMealModal;
