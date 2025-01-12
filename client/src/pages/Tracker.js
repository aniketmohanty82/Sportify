import React, { useState, useEffect } from 'react';
import MealLogForm from '../components/MealLogForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteMealModal';
import EditMealModal from '../components/EditMealModal';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import '../MealLogs.css';
import CaloriesChart from '../components/CalorieChart'; // Adjust the path as need
import { AiOutlinePlus, AiOutlineInfoCircle } from 'react-icons/ai';
import RecommendedExercises from '../components/RecommendedExercises';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const TrackerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mealLogs, setMealLogs] = useState([]);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [deletedMeal, setDeletedMeal] = useState(null); // Track the deleted meal
  const [showUndo, setShowUndo] = useState(false); // Control the visibility of the undo button

  const navigate = useNavigate(); // Initialize navigate
  const [successMessage, setSuccessMessage] = useState('');

  const [mealLogsPast, setMealLogsPast] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  //macro
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFiber, setTotalFiber] = useState(0);
  const [totalFats, setTotalFats] = useState(0);

  //micro
  const [totalCholesterol, setTotalCholesterol] = useState(0);
  const [totalSodium, setTotalSodium] = useState(0);
  const [totalSugar, setTotalSugar] = useState(0);

  const [lastSevenDaysCalories, setLastSevenDaysCalories] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [microWarningMessage, setMicroWarningMessage] = useState('');

  const [timeframe, setTimeframe] = useState(''); // Initialize as empty to ensure selection
  const [format, setFormat] = useState(''); // Initialize as empty to ensure selection
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [monthlyCalories, setMonthlyCalories] = useState([]);
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // Default to the current month
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());   // Default to the current year


  // Function to fill missing days in the dataset
  const fillMissingDays = (data, month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate(); // Get the total number of days in the month
    const filledData = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      const existingEntry = data.find((entry) => entry.date === date);
      filledData.push({
        date,
        totalCalories: existingEntry ? existingEntry.totalCalories : 0, // Use existing or default to 0
      });
    }

    return filledData;
  };

  const fetchMonthlySummary = async (month, year) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5001/api/calories/monthly?month=${month}&year=${year}`,
        { headers: { 'x-auth-token': token } }
      );
  
      if (response.ok) {
        const data = await response.json();
        const filledData = fillMissingDays(data.summary, month, year);
        setMonthlyCalories(filledData);
      } else {
        console.error('Error fetching monthly data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };  

  // Prepare chart data
  const chartData = {
    labels: monthlyCalories.map((entry) => entry.date), // Dates
    datasets: [
        {
            label: 'Calories',
            data: monthlyCalories.map((entry) => entry.totalCalories), // Calorie data
            borderColor: 'rgba(26, 166, 75, 1)', // Line color
            backgroundColor: 'rgba(26, 166, 75, 0.2)', // Fill under the line
            fill: true,
        },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
        ticks: {
          maxTicksLimit: 15, // Show fewer labels
          callback: (value) => {
            const date = monthlyCalories[value]?.date || '';
            return new Date(date).getDate(); // Show only the day number
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Calories',
        },
        beginAtZero: true,
      },
    },
  };
  
  const exercises = [
    // Beginner Exercises
    {
        name: "Walking",
        calories_per_minute: 3.5,
        fitnessLevel: "beginner",
        description: "A light cardio exercise ideal for beginners. Helps burn calories steadily and is easy on joints."
    },
    {
        name: "Stretching",
        calories_per_minute: 2,
        fitnessLevel: "beginner",
        description: "Increases flexibility and is perfect for cooling down or warming up. Suitable for any fitness level."
    },
    {
        name: "Light Yoga",
        calories_per_minute: 3,
        fitnessLevel: "beginner",
        description: "A gentle form of yoga that helps improve flexibility and mental focus. Ideal for stress relief and relaxation."
    },
    {
        name: "Stationary Cycling (low intensity)",
        calories_per_minute: 4,
        fitnessLevel: "beginner",
        description: "A low-impact cycling workout for beginners, suitable for building endurance without high strain on muscles."
    },
    {
        name: "Bodyweight Squats",
        calories_per_minute: 5,
        fitnessLevel: "beginner",
        description: "A basic lower-body workout to strengthen legs and glutes. Good for beginners with controlled movements."
    },

    // Intermediate Exercises
    {
        name: "Jogging",
        calories_per_minute: 7,
        fitnessLevel: "intermediate",
        description: "Moderate-intensity exercise for stamina. Burns calories efficiently and improves cardiovascular health."
    },
    {
        name: "Elliptical Trainer",
        calories_per_minute: 6.5,
        fitnessLevel: "intermediate",
        description: "A low-impact cardio workout that targets various muscle groups and boosts stamina. Great for moderate fitness."
    },
    {
        name: "Swimming",
        calories_per_minute: 8,
        fitnessLevel: "intermediate",
        description: "A full-body exercise that is gentle on the joints, burns calories effectively, and strengthens multiple muscle groups."
    },
    {
        name: "Rowing Machine",
        calories_per_minute: 8,
        fitnessLevel: "intermediate",
        description: "Cardio and strength exercise for building upper body endurance, stamina, and core strength."
    },
    {
        name: "Bodyweight Circuit (squats, push-ups, lunges)",
        calories_per_minute: 7.5,
        fitnessLevel: "intermediate",
        description: "A set of bodyweight exercises combined to create an effective calorie-burning circuit workout."
    },

    // Advanced Exercises
    {
        name: "Running",
        calories_per_minute: 10,
        fitnessLevel: "advanced",
        description: "High-intensity exercise for advanced levels. Increases calorie burn and cardiovascular endurance significantly."
    },
    {
        name: "Jump Rope",
        calories_per_minute: 12,
        fitnessLevel: "advanced",
        description: "A high-calorie-burning workout that improves coordination, agility, and cardiovascular endurance."
    },
    {
        name: "HIIT (High-Intensity Interval Training)",
        calories_per_minute: 14,
        fitnessLevel: "advanced",
        description: "Alternating between high and low intensity, this workout is intense and efficient for calorie burning."
    },
    {
        name: "Kettlebell Swings",
        calories_per_minute: 13,
        fitnessLevel: "advanced",
        description: "A compound movement targeting multiple muscle groups. Excellent for strength and endurance."
    },
    {
        name: "Stair Climber",
        calories_per_minute: 11,
        fitnessLevel: "advanced",
        description: "Intense lower-body workout for calorie burn and leg strengthening. Mimics climbing stairs for muscle endurance."
    },
    
    // Mixed Level Exercises
    {
        name: "Hiking",
        calories_per_minute: 6,
        fitnessLevel: "beginner, intermediate",
        description: "An outdoor activity that combines cardio with low-impact strength training. Suitable for most fitness levels."
    },
    {
        name: "Dancing",
        calories_per_minute: 5,
        fitnessLevel: "beginner, intermediate",
        description: "A fun, moderate-intensity workout that combines cardio with coordination. Suitable for beginners and intermediates."
    },
    {
        name: "Pilates",
        calories_per_minute: 4.5,
        fitnessLevel: "beginner, intermediate",
        description: "Focuses on core strength, flexibility, and control. Suitable for beginners and intermediates looking for stability."
    },
    {
        name: "Boxing",
        calories_per_minute: 9,
        fitnessLevel: "intermediate, advanced",
        description: "A high-intensity workout that combines strength and cardio. Burns calories quickly and improves hand-eye coordination."
    },
    {
        name: "Circuit Training",
        calories_per_minute: 9,
        fitnessLevel: "intermediate, advanced",
        description: "Combines cardio and strength exercises in a series, helping build endurance and burn calories."
    }
];
  // Daily calorie goal - max
  const dailyCalorieGoal = localStorage.getItem('calorieGoal');
  console.log(dailyCalorieGoal)
  console.log(localStorage.getItem('calorieGoal'))

  // daily nutrient goals - max
  const maxDailyProtein = 100;
  const maxDailyCarbs = 250;
  const maxDailyFats = 70;
  const maxDailyFiber = 30; 
  const maxDailySodium = 2300;
  const maxDailySugar = 30;
  const maxDailyCholesterol = 300;
 
  // Function to calculate percentage of the daily goal
  const caloriePercentage = Math.min((totalCalories / dailyCalorieGoal) * 100, 100);
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const showWarningMessage = (message) => {
    setWarningMessage(message);
    setTimeout(() => {
        setWarningMessage('');
    }, 10000); // Clear warning after 5 seconds
  };

  const showMicroWarningMessage = (message) => {
    setMicroWarningMessage(message);
    setTimeout(() => {
      setMicroWarningMessage('');
    }, 10000);
  };

  const handleInfoToggle = () => {
    setShowInfo(!showInfo);
  };

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
    showSuccessMessage("No Results Found!")
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
    }, 10000); // Clear message after 5 seconds
  };

  // Function to calculate the total nutrients
  const calculateTotalCalories = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayMeals = mealLogs.filter(log => {
      if (!log.date) return false; // Ensure log date is defined
      const logDate = new Date(log.date).toISOString().split('T')[0];
      return logDate === today;
    });

    // Macronutrients
    const totalCalories = todayMeals.reduce((acc, meal) => acc + (meal.nutrients || 0), 0);
    const totalProtein = todayMeals.reduce((acc, meal) => acc + (meal.protein || 0), 0);
    const totalFats = todayMeals.reduce((acc, meal) => acc + (meal.fats || 0), 0);
    const totalCarbs = todayMeals.reduce((acc, meal) => acc + (meal.carbs || 0), 0);
    const totalFiber = todayMeals.reduce((acc, meal) => acc + (meal.fiber || 0), 0);

    // Micronutrients
    const totalCholesterol = todayMeals.reduce((acc, meal) => acc + (meal.cholesterol || 0), 0);
    const totalSodium = todayMeals.reduce((acc, meal) => acc + (meal.sodium || 0), 0);
    const totalSugar = todayMeals.reduce((acc, meal) => acc + (meal.sugar || 0), 0);

    // Update state
    setTotalCalories(Math.round(totalCalories));
    setTotalProtein(Math.round(totalProtein));
    setTotalFats(Math.round(totalFats));
    setTotalCarbs(Math.round(totalCarbs));
    setTotalFiber(Math.round(totalFiber));
    setTotalCholesterol(Math.round(totalCholesterol));
    setTotalSodium(Math.round(totalSodium));
    setTotalSugar(Math.round(totalSugar));

    let exceededNutrients = [];
    let exceededMicroNutrients = [];

    // Check if any value exceeds the recommended daily limit
    if (totalProtein > maxDailyProtein) {
      exceededNutrients.push('Protein');
    }
    if (totalCarbs > maxDailyCarbs) {
      exceededNutrients.push('Carbs');
    }
    if (totalFats > maxDailyFats) {
      exceededNutrients.push('Fats');
    }
    if (totalFiber > maxDailyFiber) {
      exceededNutrients.push('Fiber');
    }

    if (totalCholesterol > maxDailyCholesterol) {
      exceededMicroNutrients.push('Cholesterol');
    }
    if (totalSodium > maxDailySodium) {
      exceededMicroNutrients.push('Sodium');
    }
    if (totalSugar > maxDailySugar) {
      exceededMicroNutrients.push('Sugar');
    }

    // If there are any exceeded nutrients, display a combined warning message
    if (exceededNutrients.length > 0) {
      showWarningMessage(`${exceededNutrients.join(', ')} exceed daily limit!`);
      exceededNutrients = [];
    }

    if (exceededMicroNutrients.length > 0) {
      showMicroWarningMessage(`${exceededMicroNutrients.join(', ')} exceed daily limit!`);
    }
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
        // await fetchMealLogsPast7Days();
        calculateTotalCalories(); //recalculate total calories
        calculateCategoryCalories();
        getLastSevenDaysCalories();
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
    const oldProtein = currentMeal.protein; // Get old protein value
    const oldCarbs = currentMeal.carbs; // Get old carbs value
    const oldFats = currentMeal.fats; // Get old fats value
    const oldFiber = currentMeal.fiber; // Get old fiber value
    const oldSodium = currentMeal.sodium; // Get old sodium value
    const oldPortionSize = currentMeal.portionSize; // Get the old portion size
    const oldCalories = currentMeal.nutrients; // Get the old calorie value
    const newPortionSize = data.portionSize; // Get the new portion size

    // Calculate the ratio of the new portion size to the old portion size
    const portionRatio = newPortionSize / oldPortionSize;

    const updatedData = {
      ...data,
      nutrients: parseFloat((oldCalories * portionRatio).toFixed(2)), // Include the new calorie value
      protein: parseFloat((oldProtein * portionRatio).toFixed(2)), // Update protein value
      carbs: parseFloat((oldCarbs * portionRatio).toFixed(2)), // Update carbs value
      fats: parseFloat((oldFats * portionRatio).toFixed(2)), // Update fats value
      fiber: parseFloat((oldFiber * portionRatio).toFixed(2)), // Update fiber value
      sodium: parseFloat((oldSodium * portionRatio).toFixed(2)), // Update sodium value
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
        // await fetchMealLogsPast7Days();
        calculateTotalCalories(); //recalculate total calories
        calculateCategoryCalories();
        //getLastSevenDaysCalories();
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
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        // Store the deleted meal
        setDeletedMeal(currentMeal);
        await fetchMealLogs();
        // await fetchMealLogsPast7Days();
        calculateTotalCalories();
        calculateCategoryCalories();
        //getLastSevenDaysCalories();
        showSuccessMessage('Meal deleted successfully!'); // Success message
        handleCloseDeleteModal();

        // Show undo option
        setShowUndo(true);
        setTimeout(() => {
          setShowUndo(false);
          setDeletedMeal(null); // Clear the deleted meal after timeout
        }, 5000); // Show for 5 seconds
      } else if (response.status === 401) {
        navigate('/login');
      } else {
        console.error('Failed to delete meal');
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const handleUndoDelete = async () => {
    if (deletedMeal) {
      // Restore the deleted meal by sending it back to your API or updating local state
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/meals/logmeal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify(deletedMeal), // Use the deleted meal data
        });

        if (response.ok) {
          await fetchMealLogs();
          // await fetchMealLogsPast7Days();
          calculateTotalCalories(); // Recalculate total calories
          calculateCategoryCalories();
          //getLastSevenDaysCalories();
          showSuccessMessage('Meal restored successfully!'); // Success message
          setShowUndo(false);
          setDeletedMeal(null); // Clear the deleted meal
        } else if (response.status === 401) {
          navigate('/login');
        } else {
          console.error('Failed to restore meal');
        }
      } catch (error) {
        console.error('Error restoring meal:', error);
      }
    }
  };

  const fetchMealLogs = async () => {
    fetchMealLogsPast7Days();
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

  const fetchMealLogsPast7Days = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/mealsPast', {
        headers: {
          'x-auth-token': token, // Include the token
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMealLogsPast(data);
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
      const dailyMeals = mealLogsPast.filter(log => {
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
    fetchMealLogsPast7Days();
  }, []);

  useEffect(() => {
    calculateTotalCalories();  // Recalculate whenever mealLogs are updated
    calculateCategoryCalories();
    getLastSevenDaysCalories();
  }, [mealLogs, mealLogsPast]);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // Months are 0-indexed
    const currentYear = today.getFullYear();

    fetchMonthlySummary(currentMonth, currentYear);
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchMonthlySummary(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear]);

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

  // Function to handle the export request
  const handleExport = async () => {
    if (!timeframe || !format) {
      alert('Please select both a timeframe and format before exporting.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5001/api/calories/export?format=${format}&timeframe=${timeframe}`, {
        headers: {
          'x-auth-token': token,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', `calorie_summary_${timeframe}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting calorie summary:', error);
      alert('Failed to export calorie summary');
    }
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
    marginBottom: '10px',
  };

  const calculateDailyAverage = (calories) => {
    const totalDays = calories.length;
    const totalCalories = calories.reduce((sum, day) => sum + day.totalCalories, 0);
    return (totalCalories / totalDays).toFixed(2); // 2 decimal places
  };

  const analyzePattern = (calories) => {
    const threshold = 1.1; // Change threshold for defining spikes or drops
    let pattern = 'Consistent';
  
    const dailyChanges = calories.map((day, index, arr) => {
      if (index === 0) return null; // Skip first day as no previous data
      const prevDay = arr[index - 1].totalCalories;
      return day.totalCalories / prevDay;
    }).filter(Boolean); // Remove null values
  
    if (dailyChanges.some((change) => change > threshold)) {
      pattern = 'Inconsistent - Spikes detected';
    } else if (dailyChanges.some((change) => change < 1 / threshold)) {
      pattern = 'Inconsistent - Drops detected';
    }
  
    return pattern;
  };
  

  return (
    <div className="tracker-page">
      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
    )}

    {showUndo && (
        <div className="undo-container">
          <p><button onClick={handleUndoDelete}>Undo</button></p>
        </div>
    )}
<div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '10px 20px',
        borderRadius: '15px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)',
      }}
    >
      {/* Add New Meal Button */}
      <button
        title="Add New"
        className="group flex items-center cursor-pointer outline-none hover:shadow-lg duration-300 transition-transform transform hover:scale-105"
        onClick={handleOpenModal}
        style={{
          backgroundColor: '#1aa64b',
          color: '#fff',
          padding: '10px 15px',
          borderRadius: '10px',
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        <AiOutlinePlus
          size={24}
          className="stroke-zinc-400 fill-none group-hover:fill-zinc-800 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300"
        />
        <span style={{ marginLeft: '8px' }}>Add a meal</span>
      </button>

      {/* Export Button with Dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          title="Export"
          className="group flex items-center cursor-pointer outline-none hover:shadow-lg duration-300 transition-transform transform hover:scale-105"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            backgroundColor: '#1aa64b',
            color: '#fff',
            padding: '10px 15px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          <span>Export Calorie Summary</span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              backgroundColor: '#fff',
              boxShadow: '0 0 8px rgba(0, 0, 0, 0.15)',
              borderRadius: '10px',
              padding: '10px',
              zIndex: 10,
            }}
          >
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="timeframe" style={{ display: 'block', marginBottom: '5px' }}>Select Timeframe:</label>
              <select
                id="timeframe"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                style={{ padding: '8px', width: '100%' }}
              >
                <option value="">-- Select Timeframe --</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="format" style={{ display: 'block', marginBottom: '5px' }}>Select Format:</label>
              <select
                id="format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                style={{ padding: '8px', width: '100%' }}
              >
                <option value="">-- Select Format --</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            <button
              onClick={() => {
                handleExport();
                setIsDropdownOpen(false); // Close dropdown after export
              }}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#1aa64b',
                color: '#fff',
                borderRadius: '5px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Export
            </button>
          </div>
        )}
      </div>
    </div>
    
    <RecommendedExercises 
        totalCalories={totalCalories} 
        dailyCalorieGoal={dailyCalorieGoal} 
        exercises={exercises} 
      />
      {/* Calorie Tracking Section */}
      <div style={{ 
        padding: '20px', 
        borderRadius: '15px', 
        backgroundColor: '#f9f9f9', 
        boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)',
        marginBottom: '20px',
      }}>
        <h2 style={{ marginBottom: '15px' }}>Calorie Tracking</h2>
        <div className="nutrient-calorie-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Circular Progress Bar (Left) */}
          <div style={{ width: '50%', paddingRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 150, height: 150 }}>
              <CircularProgressbar
                value={caloriePercentage}
                text={`${Math.round(caloriePercentage)}%`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: `rgba(26, 166, 75, 1})`,
                  textColor: '#000',
                  trailColor: '#d6d6d6',
                })}
              />
              <p style={{ textAlign: 'center', marginTop: '10px' }}>
                {totalCalories} / {dailyCalorieGoal} Calories
              </p>
            </div>
          </div>
          <div style={{ width: '50%' }}>
            <CaloriesChart calorieData={lastSevenDaysCalories} />  
          </div>
        </div>
      </div>

{/* Monthly Summary Section */}
<div
  style={{
    padding: '20px',
    borderRadius: '15px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)',
    marginBottom: '20px',
  }}
>
  <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
    Monthly Calorie Summary
  </h2>

  {/* Month Selector */}
  <div style={{ marginBottom: '15px' }}>
    <label htmlFor="month"></label>
    <select
      id="month"
      value={selectedMonth}
      onChange={(e) => {
        const selectedMonth = parseInt(e.target.value, 10);
        setSelectedMonth(selectedMonth);
      }}
      style={{
        backgroundColor: '#f9f9f9',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '14px',
        color: '#333',
        outline: 'none',
        transition: 'box-shadow 0.3s',
      }}
      onMouseOver={(e) => (e.target.style.boxShadow = '0 0 8px rgba(26, 166, 75, 0.4)')}
      onMouseOut={(e) => (e.target.style.boxShadow = 'none')}
    >
      <option value="1">January</option>
      <option value="2">February</option>
      <option value="3">March</option>
      <option value="4">April</option>
      <option value="5">May</option>
      <option value="6">June</option>
      <option value="7">July</option>
      <option value="8">August</option>
      <option value="9">September</option>
      <option value="10">October</option>
      <option value="11">November</option>
      <option value="12">December</option>
    </select>
  </div>

  {/* Daily Average Section */}
  <div
    style={{
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#1aa64b',
    }}
  >
    {monthlyCalories.length > 0 ? (
      <>
        <p>Daily Average Calories: {calculateDailyAverage(monthlyCalories)} kcal</p>
        <p>Pattern: {analyzePattern(monthlyCalories)}</p>
      </>
    ) : (
      <p>No data available for this month.</p>
    )}
  </div>

  {/* Monthly Summary Graph */}
  <div
    style={{
      width: '100%',
      maxWidth: '1200px',
      height: '300px',
      margin: '0 auto',
      overflow: 'hidden',
    }}
  >
    {monthlyCalories.length > 0 ? (
      <Line
        data={chartData}
        options={{
          ...chartOptions,
          maintainAspectRatio: false,
        }}
      />
    ) : (
      <p>No data available for this month.</p>
    )}
  </div>
</div>

  
      {/* Meal Log Tables for Breakfast, Lunch, Dinner, Snacks */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap', // Allow the meal logs to wrap if there isn't enough space
        justifyContent: 'space-between',
        padding: '20px', 
        borderRadius: '15px', 
        backgroundColor: '#f9f9f9', 
        boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)',
        marginBottom: '20px',
      }}>
        <h2 style={{ width: '100%', marginBottom: '15px' }}>Meal Logs</h2>
        {categories.map((category) => {
          const categoryCalories = calculateCategoryCalories(category);
          return (
            <div className="meal-category" key={category} style={{ flex: '1 1 20%', margin: '10px' }}>
              <h3 className="category-header">{category}: <span className="calories-text">{categoryCalories} Calories</span></h3>
              <table className="meal-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
  
      {/* Dynamic Table for MACRONUTRIENT Progress Bars */}
      <div style={{
        padding: '20px', 
        borderRadius: '15px', 
        backgroundColor: '#f9f9f9', 
        boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)',
        marginBottom: '20px',
      }}>
        <h2 style={{ marginBottom: '15px' }}>Daily Macronutrient Breakdown</h2>

        {/* Warning Message with Info Button */}
        {warningMessage && (
          <div className="warning-message" style={{ 
            backgroundColor: '#ffcccc', 
            color: '#cc0000', 
            padding: '10px', 
            borderRadius: '8px', 
            marginBottom: '20px', 
            boxShadow: '0 0 5px rgba(204, 0, 0, 0.5)', 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center', // Aligns the button with the text
          }}>
            <p style={{ margin: 0 }}>{warningMessage}</p>
            <button onClick={handleInfoToggle}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#333' }}>
              <AiOutlineInfoCircle size={20} />
            </button>
            {showInfo && (
              <div style={{ marginTop: '5px', backgroundColor: '#fff', border: '5px solid #ccc',
                            padding: '5px', borderRadius: '5px', position: 'absolute', zIndex: '100',
                }}>
                <p>Recommended Daily Values:</p>
                <ul>
                  <li>Protein: {maxDailyProtein} g {totalProtein - maxDailyProtein > 0 && `(Exceeded by: ${totalProtein - maxDailyProtein} g)`}</li>
                  <li>Carbs: {maxDailyCarbs} g {totalCarbs - maxDailyCarbs > 0 && `(Exceeded by: ${totalCarbs - maxDailyCarbs} g)`}</li>
                  <li>Fats: {maxDailyFats} g {totalFats - maxDailyFats > 0 && `(Exceeded by: ${totalFats - maxDailyFats} g)`}</li>
                  <li>Fiber: {maxDailyFiber} g {totalFiber - maxDailyFiber > 0 && `(Exceeded by: ${totalFiber - maxDailyFiber} g)`}</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Check if there's any data, if not show "No data available" */}
        {(totalProtein === 0 && totalFats === 0 && totalCarbs === 0 && totalFiber === 0) ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '1.2em' }}>
            No data available for today - begin by adding in a new meal! 
          </p>
        ) : (
        <div className="nutrient-progress-bars" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {[
            { label: 'Protein', value: totalProtein, goal: 100, color: 'bg-success' },
            { label: 'Fats', value: totalFats, goal: 70, color: 'bg-warning' },
            { label: 'Carbs', value: totalCarbs, goal: 250, color: 'bg-info' },
            { label: 'Fibers', value: totalFiber, goal: 30, color: 'bg-danger' },
          ].map(({ label, value, goal, color }) => (
            <div className="progress-bar-wrapper" key={label} style={{ flex: '1 1 22%', margin: '10px' }}>
              <label>{label}</label>
              <div className="progress">
                <div
                  className={`progress-bar ${color}`}
                  role="progressbar"
                  style={{ width: `${calculateNutrientProgress(value, goal)}%` }}
                >
                  {value}g
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Dynamic Table for MICRONUTRIENT Progress Bars */}
    <div style={{
        padding: '20px', 
        borderRadius: '15px', 
        backgroundColor: '#f9f9f9', 
        boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)',
        marginBottom: '20px',
      }}>
        <h2 style={{ marginBottom: '15px' }}>Daily Micronutrient Breakdown</h2>

        {/* Warning Message with Info Button */}
        {microWarningMessage && (
          <div className="warning-message" style={{ 
            backgroundColor: '#ffcccc', 
            color: '#cc0000', 
            padding: '10px', 
            borderRadius: '8px', 
            marginBottom: '20px', 
            boxShadow: '0 0 5px rgba(204, 0, 0, 0.5)', 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center', // Aligns the button with the text
          }}>
            <p style={{ margin: 0 }}>{microWarningMessage}</p>
            <button onClick={handleInfoToggle}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#333' }}>
              <AiOutlineInfoCircle size={20} />
            </button>
            {showInfo && (
              <div style={{ marginTop: '5px', backgroundColor: '#fff', border: '5px solid #ccc',
                            padding: '5px', borderRadius: '5px', position: 'absolute', zIndex: '100',
                }}>
                <p>Recommended Daily Values:</p>
                <ul>
                  <li>Cholesterol: {maxDailyCholesterol} mg {totalCholesterol - maxDailyCholesterol > 0 && `(Exceeded by: ${totalCholesterol - maxDailyCholesterol} mg)`}</li>
                  <li>Sugar: {maxDailySugar} g {totalSugar - maxDailySugar > 0 && `(Exceeded by: ${totalSugar - maxDailySugar} g)`}</li>
                  <li>Sodium: {maxDailySodium} mg {totalSodium - maxDailySodium > 0 && `(Exceeded by: ${totalSodium - maxDailySodium} mg)`}</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Check if there's any data, if not show "No data available" */}
        {(totalCholesterol === 0 && totalSodium === 0 && totalSugar === 0) ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '1.2em' }}>
            No data available for today - begin by adding in a new meal! 
          </p>
        ) : (
        <div className="nutrient-progress-bars" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {[
            { label: 'Cholesterol', value: totalCholesterol, goal: 300, color: 'bg-success' },
            { label: 'Sodium', value: totalSodium, goal: 2300, color: 'bg-info' },
            { label: 'Sugar', value: totalSugar, goal: 30, color: 'bg-danger' },
          ].map(({ label, value, goal, color }) => (
            <div className="progress-bar-wrapper" key={label} style={{ flex: '1 1 22%', margin: '10px' }}>
              <label>{label}</label>
              <div className="progress">
                <div
                  className={`progress-bar ${color}`}
                  role="progressbar"
                  style={{ width: `${calculateNutrientProgress(value, goal)}%` }}
                >
                  {value}g
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  
      {/* Modals and Success Message */}
      <MealLogForm isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormSubmit} onError={handleCloseModal2} />
      <EditMealModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        onDelete={() => handleOpenDeleteModal(currentMeal)}
        meal={currentMeal}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteMeal}
        mealName={currentMeal?.foodItem}
      />
    </div>
  );
  
};

export default TrackerPage;
