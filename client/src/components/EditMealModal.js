import React, { useState, useEffect } from 'react';

const EditMealModal = ({ isOpen, onClose, onSubmit, meal }) => {
  const [formData, setFormData] = useState({ foodItem: '', mealCategory: '', calories: 0 });

  useEffect(() => {
    if (meal) {
      setFormData({
        foodItem: meal.foodItem,
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
    onSubmit(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Meal</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="foodItem"
            value={formData.foodItem}
            onChange={handleChange}
            placeholder="Food Item"
            required
          />
          <input
            type="text"
            name="mealCategory"
            value={formData.mealCategory}
            onChange={handleChange}
            placeholder="Meal Category"
            required
          />
          <input
            type="number"
            name="calories"
            value={formData.nutrients}
            onChange={handleChange}
            placeholder="Calories"
            required
          />
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditMealModal;
