import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import MealLogForm from '../components/MealLogForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import EditMealModal from '../components/EditMealModal';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import '../App.css';
import '../MealLogs.css';

const TrackerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mealLogs, setMealLogs] = useState([]);
  const [currentMeal, setCurrentMeal] = useState(null);
  const navigate = useNavigate(); // Initialize navigate
  const [successMessage, setSuccessMessage] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);


  // // Sample meal logs
  // const [mealLogs, setMealLogs] = useState([
  //   { foodItem: 'Oatmeal', portionSize: '1 cup', nutrients: 150, mealCategory: 'Breakfast' },
  //   { foodItem: 'Chicken Salad', portionSize: '200g', nutrients: 300, mealCategory: 'Lunch' },
  //   { foodItem: 'Grilled Salmon', portionSize: '150g', nutrients: 350, mealCategory: 'Dinner' },
  //   { foodItem: 'Apple', portionSize: '1 medium', nutrients: 95, mealCategory: 'Snacks' }
  // ]);

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMeal(null);
  };

  const handleOpenEditModal = (meal) => {
    setCurrentMeal(meal);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentMeal(null);
  };

  const handleOpenDeleteModal = (meal) => {
    setCurrentMeal(meal);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentMeal(null);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000); // Clear message after 5 seconds
  };

  // Function to calculate the total calories for the day - user story #9
  const calculateTotalCalories = () => {
    const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
    const todayMeals = mealLogs.filter(log => {
      const logDate = new Date(log.date).toISOString().split('T')[0]; // Compare log date with today
      return logDate === today;
    });

    const total = todayMeals.reduce((acc, meal) => acc + meal.nutrients, 0);  // Sum calories
    setTotalCalories(total.toFixed(2));  // Update the state
  };

  const handleFormSubmit = async (data) => {
    console.log('Meal logged:', data);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/meals/logmeal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Include the token in the headers
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchMealLogs();
        calculateTotalCalories(); //recalculate total calories
        showSuccessMessage('Meal added successfully!'); // Success message
        handleCloseModal();
      } else if (response.status === 401) {
        // Unauthorized, redirect to login
        navigate('/login');
      } else {
        console.error('Failed to log meal');
      }
    } catch (error) {
      console.error('Error logging meal:', error);
    }
  };

  const handleEditSubmit = async (data) => {
    console.log('Meal edited:', data);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/meals/${currentMeal._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Include the token
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchMealLogs();
        calculateTotalCalories(); //recalculate total calories
        showSuccessMessage('Meal edited successfully!'); // Success message
        handleCloseEditModal();
      } else if (response.status === 401) {
        navigate('/login');
      } else {
        console.error('Failed to edit meal');
      }
    } catch (error) {
      console.error('Error editing meal:', error);
    }
  };

  const handleDeleteMeal = async () => {
    console.log(currentMeal._id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/meals/${currentMeal._id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token, // Include the token
        },
      });

      if (response.ok) {
        await fetchMealLogs();
        calculateTotalCalories(); //recalculate total calories
        showSuccessMessage('Meal deleted successfully!'); // Success message
        handleCloseDeleteModal();
      } else if (response.status === 401) {
        navigate('/login');
      } else {
        console.error('Failed to delete meal');
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const fetchMealLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/meals', {
        headers: {
          'x-auth-token': token, // Include the token
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMealLogs(data);
      } else if (response.status === 401) {
        // Unauthorized, redirect to login
        navigate('/login');
      } else {
        console.error('Failed to fetch meal logs');
      }
    } catch (error) {
      console.error('Error fetching meal logs:', error);
    }
  };

  useEffect(() => {
    fetchMealLogs();
  }, []);

  useEffect(() => {
    calculateTotalCalories();  // Recalculate whenever mealLogs are updated
  }, [mealLogs]);


  const getMealsByCategory = (category) => {
    return mealLogs.filter((log) => log.mealCategory === category);
  };

  const handleRowClick = (meal) => {
    setCurrentMeal(meal);
    setIsEditModalOpen(true);
  };

  return (
    <div className="tracker-page">
      <button
        title="Add New"
        className="group cursor-pointer outline-none hover:rotate-90 duration-300"
        onClick={handleOpenModal}
      >
        <AiOutlinePlus
          size={50}
          className="stroke-zinc-400 fill-none group-hover:fill-zinc-800 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300"
        />
      </button>

      <MealLogForm isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormSubmit} />
      <EditMealModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit} // Pass handleEditSubmit as the onSubmit handler
        onDelete={() => handleOpenDeleteModal(currentMeal)} // This line is important
        meal={currentMeal}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteMeal}
        mealName={currentMeal?.foodItem}
      />

      {successMessage && (
              <div className="success-message">
                <p>{successMessage}</p>
              </div>
            )}

      <h2>Today's Meals</h2>
      <div className="meal-logs-container">
        {categories.map((category) => (
          <div className="meal-category" key={category}>
            <h3>{category}</h3>
            <table className="meal-table">
              <thead>
                <tr>
                  <th>Food Item</th>
                  <th>Portion Size</th>
                  <th>Calories</th>
                </tr>
              </thead>
              <tbody>
                {getMealsByCategory(category).length > 0 ? (
                  getMealsByCategory(category).map((log, index) => (
                    <tr key={index} onClick={() => handleRowClick(log)} className="meal-row">
                      <td>{log.foodItem}</td>
                      <td>{log.portionSize}</td>
                      <td>{log.nutrients} calories</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No meals logged</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Total Calorie Intake Display */}
      <div className="total-calories-container">
        <h2>Total Calories for Today: {totalCalories} calories</h2> 
      </div>
    </div>
  );
};

export default TrackerPage;
