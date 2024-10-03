import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import MealLogForm from '../components/MealLogForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import EditMealModal from '../components/EditMealModal';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import '../MealLogs.css';
import CaloriesChart from '../components/CalorieChart'; // Adjust the path as need

const TrackerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentMeal, setCurrentMeal] = useState(null);

  const navigate = useNavigate(); // Initialize navigate

  const [successMessage, setSuccessMessage] = useState('');

  const [mealLogs, setMealLogs] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalFats, setTotalFats] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFiber, setTotalFiber] = useState(0);
  const [lastSevenDaysCalories, setLastSevenDaysCalories] = useState([]);

  const [loading, setLoading] = useState(true);

  // Daily calorie goal
  const dailyCalorieGoal = 2000;
 
  // Function to calculate percentage of the daily goal
  const caloriePercentage = Math.min((totalCalories / dailyCalorieGoal) * 100, 100);

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMeal(null);
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
    const today = new Date().toISOString().split('T')[0];
    const todayMeals = mealLogs.filter(log => {
      if (!log.date) return false; // Ensure log date is defined
      const logDate = new Date(log.date).toISOString().split('T')[0];
      return logDate === today;
    });
  
    const totalCalories = todayMeals.reduce((acc, meal) => acc + (meal.nutrients || 0), 0);
    const totalProtein = todayMeals.reduce((acc, meal) => acc + (meal.protein || 0), 0);
    const totalFats = todayMeals.reduce((acc, meal) => acc + (meal.fats || 0), 0);
    const totalCarbs = todayMeals.reduce((acc, meal) => acc + (meal.carbs || 0), 0);
    const totalFiber = todayMeals.reduce((acc, meal) => acc + (meal.fiber || 0), 0);


    setTotalCalories(Math.round(totalCalories));
    setTotalProtein(Math.round(totalProtein));
    setTotalFats(Math.round(totalFats));
    setTotalCarbs(Math.round(totalCarbs));
    setTotalFiber(Math.round(totalFiber));
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const getLastSevenDaysCalories = () => {

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // Get the date 6 days before today

    // Initialize an array to store calorie counts for the last 7 days
    const caloriesByDate = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(sevenDaysAgo);
      currentDay.setDate(sevenDaysAgo.getDate() + i);

      // Format the date for comparison (YYYY-MM-DD)
      const formattedDate = currentDay.toISOString().split('T')[0];

      // Filter meal logs for the current day
      const dailyMeals = mealLogs.filter(log => {
        const logDate = new Date(log.date).toISOString().split('T')[0];
        return logDate === formattedDate;
      });

      // Sum the calories for that day
      const totalCalories = dailyMeals.reduce((total, meal) => total + meal.nutrients, 0);

      // Push the result into the array
      caloriesByDate.push({
        date: formattedDate,
        calories: totalCalories,
      });
    }

    setLastSevenDaysCalories(caloriesByDate);
  };


  useEffect(() => {
    fetchMealLogs();
  }, []);

  useEffect(() => {
    calculateTotalCalories();
    getLastSevenDaysCalories();
  }, [mealLogs]); // Recalculate when mealLogs change


  const getMealsByCategory = (category) => {
    return mealLogs.filter((log) => log.mealCategory === category);
  };

  const handleRowClick = (meal) => {
    setCurrentMeal(meal);
    setIsEditModalOpen(true);
  };

  const calculateNutrientProgress = (nutrientAmount, maxAmount) => {
    return Math.min((nutrientAmount / maxAmount) * 100, 100); // Ensure the progress doesn't exceed 100%
  };

  // UI starts here
  return (
    <div className="tracker-page">
      {/* Nutrient and Calorie Progress Section */}
      <div className="nutrient-calorie-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', paddingBottom: '20px' }}>
      {/* Circular Progress Bar (Left) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '50%', paddingRight: '20px' }}>
        <div style={{ width: 150, height: 150 }}>
          <CircularProgressbar
            value={caloriePercentage}
            text={`${Math.round(caloriePercentage)}%`}
            styles={buildStyles({
              textSize: '16px',
              pathColor: `rgba(62, 152, 199, ${caloriePercentage / 100})`,
              textColor: '#000',
              trailColor: '#d6d6d6',
            })}
          />
          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            {totalCalories} / {dailyCalorieGoal} Calories
          </p>
        </div>
      </div>

        {/* Nutrient Progress Bars (Right) */}
        <div className="nutrient-progress-bars" style={{ width: '50%' }}>
        <div className="progress-bar-wrapper">
            <label>Protein</label>
            <div className="progress">
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${calculateNutrientProgress(totalProtein, 100)}%` }}
                aria-valuenow="30"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {totalProtein}g
              </div>
            </div>
          </div>
  
          <div className="progress-bar-wrapper">
            <label>Fats</label>
            <div className="progress">
              <div
                className="progress-bar bg-warning"
                role="progressbar"
                style={{ width: `${calculateNutrientProgress(totalFats, 70)}%` }}
                aria-valuenow="20"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {totalFats}g
              </div>
            </div>
          </div>
  
          <div className="progress-bar-wrapper">
            <label>Carbs</label>
            <div className="progress">
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{ width: `${calculateNutrientProgress(totalCarbs, 250)}%` }}
                aria-valuenow="50"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {totalCarbs}g
              </div>
            </div>
          </div>
  
          <div className="progress-bar-wrapper">
            <label>Fibers</label>
            <div className="progress">
              <div
                className="progress-bar bg-danger"
                role="progressbar"
                style={{ width: `${calculateNutrientProgress(totalFiber, 30)}%` }}
                aria-valuenow="10"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {totalFiber}g
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        title="Add New"
        className="group flex items-center cursor-pointer outline-none hover:rotate-90 duration-300"
        onClick={handleOpenModal}
      >
        <AiOutlinePlus
          size={30} // Make the plus icon smaller
          className="stroke-zinc-400 fill-none group-hover:fill-zinc-800 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300"
        />
        <span style={{ marginLeft: '8px', fontSize: '16px' }}>Add a meal</span> {/* Add text next to the plus icon */}
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

      {/* Current Date Display */}
      <h2 style={{ marginTop: '20px' }}>{new Date().toLocaleDateString()}</h2>
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
        {/* Dynamic Table for Calorie Counts of the Last Seven Days */}
        <h2 style={{ marginTop: '40px' }}>Calorie Counts for the Last 7 Days</h2>
      <CaloriesChart calorieData={lastSevenDaysCalories} />
      </div>
  );
};

export default TrackerPage;
