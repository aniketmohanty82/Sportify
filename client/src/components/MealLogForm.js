import React, { useState, useEffect } from 'react';
import { useForm } from 'react-cool-form';
import '../MealLogForm.css'; // Import the CSS file for styling

const Field = ({ label, id, ...rest }) => (
  <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} className="input" {...rest} />
  </div>
);

const Select = ({ label, id, children, ...rest }) => (
  <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <select id={id} className="select" {...rest}>
      {children}
    </select>
  </div>
);

const MealLogForm = ({ onSubmit, isOpen, onClose, onError }) => {
  const { form, reset } = useForm({
    defaultValues: {
      foodItem: '',
      portionSize: '',
      mealCategory: '',
    },
    onSubmit: async (values) => {
      const { foodItem, portionSize, mealCategory } = values;

      if (!foodItem) {
        alert('Please enter a food item.');
        return;
      }

      if (portionSize <= 0) {
        alert('Please enter the portion size.');
        return;
      }

      if (!mealCategory) {
        alert('Please choose the meal category.');
        return;
      }

      const queryStr = `${portionSize} ${foodItem}`;
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
        console.log(data); // Log nutrient data for now

        onSubmit({
          userId: localStorage.getItem('userId'),
          foodItem,
          portionSize,
          mealCategory,
          date: new Date(),
          nutrients: data.items[0].calories, // Add the nutrients to the submitted data
          protein: data.items[0].protein_g,
          carbs: data.items[0].carbohydrates_total_g,
          fats: data.items[0].fat_total_g,
          fiber: data.items[0].fiber_g,
          sodium: data.items[0].sodium_mg,
        });

        // Clear the form after submission
        reset();
        onClose(); // Close the modal after submission
      } catch (error) {
        console.error('Error fetching nutrient data:', error);
        onError(); 
        // reset()
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
        <h2 className="title">Log Your Meal</h2>
        <form ref={form}>
          <Field
            label="Food Item"
            id="foodItem"
            name="foodItem"
            placeholder="Enter food item..."
          />
          <Field
            label="Portion Size"
            id="portionSize"
            name="portionSize"
            type="number"
            min="1" // Prevents negative values
            placeholder="Enter portion size..."
          />
          <Select label="Meal Category" id="mealCategory" name="mealCategory">
            <option value="">Select Meal Category</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
          </Select>
          <button type="submit" className="btn">Log Meal</button>
        </form>
      </div>
    </div>
  );
};

export default MealLogForm;
