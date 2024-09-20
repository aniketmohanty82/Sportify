import React, { useState } from 'react';
import '../App.css'; // Import the CSS file for styling

const MealLogForm = ({ onSubmit, isOpen, onClose }) => {
  const [selectedFood, setSelectedFood] = useState('');
  const [portionSize, setPortionSize] = useState('');
  const [mealCategory, setMealCategory] = useState('');

  const handleFoodSelect = (item) => {
    setSelectedFood(item.name); // Adjust based on item structure
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryStr = `${portionSize} ${selectedFood}`;
    try {
      const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(queryStr)}`, {
        method: 'GET',
        headers: {
          'X-Api-Key': 'vKu/m4vOMPsNGv8lJHj/EQ==W2JzV2z7C4B7R2tU', // Replace with your actual API key
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      // Handle the API response here
    } catch (error) {
      console.error('Error fetching food data:', error);
    }

    if (selectedFood && portionSize && mealCategory) {
      onSubmit({ foodItem: selectedFood, portionSize, mealCategory });
      setSelectedFood('');
      setPortionSize('');
      setMealCategory('');
      onClose(); // Close the modal after submission
    } else {
      alert('Please fill out all fields.');
    }
  };

  if (!isOpen) return null; // Render nothing if the modal is not open

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="title">Log Your Meal</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="foodItem">Food Item:</label>
            <input
              id="foodItem"
              type="text"
              value={selectedFood}
              onChange={(e) => setSelectedFood(e.target.value)}
              placeholder="Type to search food"
              className="input-field"
            />
          </div>
          <div className="field">
            <label htmlFor="portionSize">Portion Size:</label>
            <input
              id="portionSize"
              type="number"
              value={portionSize}
              onChange={(e) => setPortionSize(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="field">
            <label htmlFor="mealCategory">Meal Category:</label>
            <select
              id="mealCategory"
              value={mealCategory}
              onChange={(e) => setMealCategory(e.target.value)}
              className="input-field"
            >
              <option value="">Select Meal Category</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
          <button type="submit" className="btn">Log Meal</button>
        </form>
      </div>
    </div>
  );
};

export default MealLogForm;
