import React, { useState, useEffect } from 'react';

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
    //console.log('Saving changes:', formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Meal</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="foodItem">Food Item:</label>
            <input
              type="text"
              id="foodItem"
              name="foodItem"
              value={formData.foodItem}
              placeholder="Food Item"
              required
              disabled
            />
          </div>
          <div>
            <label htmlFor="portionSize">Portion Size:</label>
            <input
              type="text"
              id="portionSize"
              name="portionSize"
              value={formData.portionSize}
              onChange={handleChange}
              placeholder="Portion Size"
              required
            />
          </div>
          <div>
            <label htmlFor="mealCategory">Meal Category:</label>
            <input
              type="text"
              id="mealCategory"
              name="mealCategory"
              value={formData.mealCategory}
              placeholder="Meal Category"
              required
              disabled
            />
          </div>
          <div>
            <label htmlFor="calories">Calories:</label>
            <input
              type="number"
              id="calories"
              name="nutrients" // anisha's change
              value={formData.nutrients}
              onChange={handleChange} // Allow user to edit nutrients
              placeholder="Calories"
              required
              //disabled
            />
          </div>
          <div className="button-group">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="button" onClick={onDelete}>Delete Meal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMealModal;
