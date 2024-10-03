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
  const [mealLogs, setMealLogs] = useState([]);
  const [currentMeal, setCurrentMeal] = useState(null);
  const navigate = useNavigate(); // Initialize navigate
  const [successMessage, setSuccessMessage] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);

   // Daily calorie goal
   const dailyCalorieGoal = 2000;

  //  // Calculate total calories from logged meals
  //  setTotalCalories(1000);
 
  //  // Function to calculate percentage of the daily goal
   const caloriePercentage = (totalCalories / dailyCalorieGoal) * 100;
  // const caloriePercentage = 0;



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

  const handleCloseModal2 = () => {
    setIsModalOpen(false);
    setCurrentMeal(null);
    showSuccessMessage('No Results Found!')
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
    setTotalCalories(total.toFixed(1));  // Update the state
  };

  const calculateCategoryCalories = (category) => {
    return mealLogs
      .filter((log) => log.mealCategory === category)
      .reduce((total, meal) => total + meal.nutrients, 0)
      .toFixed(2); // Sum calories for the category
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
        calculateCategoryCalories();
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
      // Calculate new calories based on the change in portion size
    const oldPortionSize = currentMeal.portionSize; // Get the old portion size
    const oldCalories = currentMeal.nutrients; // Get the old calorie value
    const newPortionSize = data.portionSize; // Get the new portion size

    // Calculate the ratio of the new portion size to the old portion size
    const portionRatio = newPortionSize / oldPortionSize;

    // Calculate the new calories based on the portion ratio
    const newCalories = oldCalories * portionRatio;

    // Prepare updated data to send to the database
    const updatedData = {
      ...data,
      nutrients: newCalories, // Include the new calorie value
    };
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/meals/${currentMeal._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Include the token
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        await fetchMealLogs();
        calculateTotalCalories(); //recalculate total calories
        calculateCategoryCalories();
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
        calculateCategoryCalories();
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
    calculateCategoryCalories();
  }, [mealLogs]);


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

  const lastSevenDaysCalories = [
    { date: '2024-09-26', calories: 2000 },
    { date: '2024-09-27', calories: 1800 },
    { date: '2024-09-28', calories: 2100 },
    { date: '2024-09-29', calories: 1900 },
    { date: '2024-09-30', calories: 2200 },
    { date: '2024-10-01', calories: 2000 },
    { date: '2024-10-02', calories: 2100 },
  ];
  

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
                style={{ width: `${calculateNutrientProgress(30, 100)}%` }}
                aria-valuenow="30"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                30g
              </div>
            </div>
          </div>
  
          <div className="progress-bar-wrapper">
            <label>Fats</label>
            <div className="progress">
              <div
                className="progress-bar bg-warning"
                role="progressbar"
                style={{ width: `${calculateNutrientProgress(20, 70)}%` }}
                aria-valuenow="20"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                20g
              </div>
            </div>
          </div>
  
          <div className="progress-bar-wrapper">
            <label>Carbs</label>
            <div className="progress">
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{ width: `${calculateNutrientProgress(50, 250)}%` }}
                aria-valuenow="50"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                50g
              </div>
            </div>
          </div>
  
          <div className="progress-bar-wrapper">
            <label>Fibers</label>
            <div className="progress">
              <div
                className="progress-bar bg-danger"
                role="progressbar"
                style={{ width: `${calculateNutrientProgress(10, 30)}%` }}
                aria-valuenow="10"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                10g
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

      <MealLogForm isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormSubmit} onError={handleCloseModal2}/>
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
  {categories.map((category) => {
    const categoryCalories = calculateCategoryCalories(category); // Calculate calories for each category

    return (
      <div className="meal-category" key={category}>
        <h3 className="category-header">{category}: <span className="calories-text">{categoryCalories} Calories</span></h3> {/* Show category and calories */}
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
    );
  })}
</div>
      {/* Static Table for Calorie Counts of the Last Seven Days */}
    <h2 style={{ marginTop: '40px' }}>Calorie Counts for the Last 7 Days</h2>
    <table className="calorie-counts-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Calories</th>
        </tr>
      </thead>
      <tbody>
        {/* Assuming you have an array of calorie data for the last 7 days */}
        {lastSevenDaysCalories.map((data, index) => (
          <tr key={index}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{data.date}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{data.calories}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <CaloriesChart calorieData={lastSevenDaysCalories} />

      {/* Total Calorie Intake Display */}
      <div className="total-calories-container">
        <h2>Total Calories for Today: {totalCalories} calories</h2> 
      </div>
    </div>
  );  
};

export default TrackerPage;
