import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-cool-form';
import '../MealLogForm.css'; // Import the CSS file for styling

const Field = ({ label, id, ...rest }) => (
  <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} {...rest} />
  </div>
);

const Select = ({ label, id, children, ...rest }) => (
  <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <select id={id} {...rest}>
      {children}
    </select>
  </div>
);

const MealLogForm = ({ onSubmit, isOpen, onClose }) => {
  const { form, reset } = useForm({
    defaultValues: {
      foodItem: '',
      portionSize: '',
      mealCategory: '',
    },
    onSubmit: async (values) => {
      const { foodItem, portionSize, mealCategory } = values;

      if (!selectedFoodId) {
        alert('Please select a food item.');
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
          foodItem,
          portionSize,
          mealCategory,
          date: new Date(),
          nutrients: data.items[0].calories, // Add the nutrients to the submitted data
        });

        // Clear the form after submission
        reset();
        onClose(); // Close the modal after submission
      } catch (error) {
        console.error('Error fetching nutrient data:', error);
      }
    },
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [foodList, setFoodList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFood, setSelectedFood] = useState('');
  const [selectedFoodId, setSelectedFoodId] = useState(null); // Store food FDC ID

  const dropdownRef = useRef();

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
    setSearchQuery(food.description); // Set the input field to the selected food
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside of the dropdown
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      // Reset the component state when closed
      reset();
      setSearchQuery('');
      setSelectedFood('');
      setShowDropdown(false);
      setSelectedFoodId(null);
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
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedFood('');
              setShowDropdown(true);
            }}
            placeholder="Search for food..."
          />
          {showDropdown && foodList.length > 0 && (
            <ul className="dropdown" ref={dropdownRef}>
              {foodList.map((food) => (
                <li key={food.fdcId} onClick={() => handleFoodSelection(food)}>
                  {food.description}
                </li>
              ))}
            </ul>
          )}
          <Field
            label="Portion Size"
            id="portionSize"
            name="portionSize"
            type="number"
          />
          <Select label="Meal Category" id="mealCategory" name="mealCategory">
            <option value="">Select Meal Category</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="dinner">Snacks</option>
          </Select>
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