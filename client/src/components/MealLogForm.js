import React, { useState, useEffect } from 'react';
import '../App.css'; // Import the CSS file for styling

const MealLogForm = ({ onSubmit, isOpen, onClose }) => {
  const [selectedFood, setSelectedFood] = useState('');
  const [selectedFoodId, setSelectedFoodId] = useState(null); // Store food FDC ID
  const [searchQuery, setSearchQuery] = useState('');
  const [portionSize, setPortionSize] = useState('');
  const [mealCategory, setMealCategory] = useState('');
  const [foodList, setFoodList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch the list of foods from FSDA API when searchQuery changes
  useEffect(() => {
    const fetchFoodList = async () => {
      if (searchQuery.trim() === '') return; // Don't search if input is empty

      try {
        const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(searchQuery)}&dataType=Branded,Foundation,Survey%20%28FNDDS%29,SR%20Legacy&pageSize=10&pageNumber=1&sortBy=dataType.keyword&sortOrder=asc&api_key=stCXO9gkvyjGi6ocwnjMtekGMHgVX3yx2B4p2JfR`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching food list: ${response.status}`);
        }

        const data = await response.json();
        setFoodList(data.foods || []); // Ensure the result is an array
        setShowDropdown(true); // Show the dropdown when search results are available
      } catch (error) {
        console.error('Error fetching food list:', error);
      }
    };

    fetchFoodList();
  }, [searchQuery]);

  const handleFoodSelection = (food) => {
    setShowDropdown(false);
    setSelectedFood(food.description); // Set the selected food
    setSelectedFoodId(food.fdcId); // Save the selected food's FDC ID
    //setSearchQuery(food.description); // Set the input field to the selected food
    //setShowDropdown(false); // Hide the dropdown after selecting a food
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFoodId) {
      alert('Please select a food item.');
      return;
    }

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
      console.log(data); // Log nutrient data for now

      // If the food, portion size, and meal category are filled, submit the form
      if (selectedFood && portionSize && mealCategory) {
        // Submit the selected food along with the fetched nutrients data
        onSubmit({ 
          foodItem: selectedFood, 
          portionSize, 
          mealCategory, 
          nutrients: data.items[0].calories // Add the nutrients to the submitted data
        });
        
        // Clear the form after submission
        setSelectedFood('');
        setSelectedFoodId(null);
        setSearchQuery('');
        setPortionSize('');
        setMealCategory('');
        onClose(); // Close the modal after submission
      } else {
        alert('Please fill out all fields.');
      }
    } catch (error) {
      console.error('Error fetching nutrient data:', error);
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              placeholder="Search for food..."
            />
            {showDropdown && foodList.length > 0 && (
              <ul className="dropdown">
                {foodList.map((food) => (
                  <li key={food.fdcId} onClick={() => handleFoodSelection(food)}>
                    {food.description}
                  </li>
                ))}
              </ul>
            )}
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



  // try {
    //   // Call the USDA API with the selected FDC ID and the nutrients
    //   const response = await fetch(`https://api.nal.usda.gov/fdc/v1/food/${selectedFoodId}?api_key=stCXO9gkvyjGi6ocwnjMtekGMHgVX3yx2B4p2JfR`, {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });


  // const queryStr = `${portionSize} ${selectedFood}`;
  // try {
  //   const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(queryStr)}`, {
  //     method: 'GET',
  //     headers: {
  //       'X-Api-Key': 'vKu/m4vOMPsNGv8lJHj/EQ==W2JzV2z7C4B7R2tU', // Replace with your actual API key
  //     },
  //   });