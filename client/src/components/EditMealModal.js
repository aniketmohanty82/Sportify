import React, { useState, useEffect } from 'react';
import '../MealLogForm.css'; // Import the same CSS file for styling

const EditMealModal = ({ isOpen, onClose, meal, onDelete, onSubmit }) => {
  const [formData, setFormData] = useState({ foodItem: '', portionSize: '', mealCategory: '', nutrients: 0 });

  useEffect(() => {
    if (meal) {
      setFormData({
        foodItem: meal.foodItem,
        portionSize: meal.portionSize,
        mealCategory: meal.mealCategory,
        nutrients: meal.nutrients,
      });
    }
  }, [meal]);

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
    // Handle save changes
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="title">Edit Meal</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="foodItem">Food Item:</label>
            <input
              type="text"
              id="foodItem"
              name="foodItem"
              value={formData.foodItem}
              placeholder="Food Item"
              required
              disabled
              className="input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="portionSize">Portion Size:</label>
            <input
              type="number"
              min="0"
              id="portionSize"
              name="portionSize"
              value={formData.portionSize}
              onChange={handleChange}
              placeholder="Portion Size"
              required
              className="input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="mealCategory">Meal Category:</label>
            <input
              type="text"
              id="mealCategory"
              name="mealCategory"
              value={formData.mealCategory}
              placeholder="Meal Category"
              required
              disabled
              className="input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="calories">Calories:</label>
            <input
              type="text"
              id="calories"
              name="nutrients"
              value={formData.nutrients}
              placeholder="Calories"
              required
              disabled
              className="input"
            />
          </div>
          <button type="submit" className="btn">Save Changes</button>
          <button type="button" onClick={onClose} className="btn">Cancel</button>
          <button type="deleteButton" onClick={onDelete} className="btn">Delete Meal</button>
        </form>
      </div>
    </div>
  );
};

export default EditMealModal;
