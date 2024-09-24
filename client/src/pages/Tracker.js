import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import MealLogForm from '../components/MealLogForm'; // Import the MealLogForm component
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'; // Import the ConfirmDeleteModal component
import EditMealModal from '../components/EditMealModal'; // Import the EditMealModal component
import '../App.css'; // Import the CSS file for other styling
import '../MealLogs.css'; // Import the new MealLogs CSS file

const TrackerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mealLogs, setMealLogs] = useState([]);
  const [currentMeal, setCurrentMeal] = useState(null); // To store the meal to be edited or deleted

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMeal(null); // Clear the current meal when closing the modal
  };

  const handleOpenEditModal = (meal) => {
    setCurrentMeal(meal);
    //console.log(currentMeal)
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentMeal(null); // Clear the current meal when closing the edit modal
  };

  const handleOpenDeleteModal = (meal) => {
    setCurrentMeal(meal);
    //console.log(meal)
    //console.log(currentMeal)
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentMeal(null); // Clear the current meal when closing the delete modal
  };

  const handleFormSubmit = async (data) => {
    console.log('Meal logged:', data);
    // Send data to backend
    try {
      const response = await fetch('http://localhost:5001/api/meals/logmeal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchMealLogs(); // Wait for the fetch to complete
        handleCloseModal(); // Close the modal after successful submission
      } else {
        console.error('Failed to log meal');
      }
    } catch (error) {
      console.error('Error logging meal:', error);
    }
  };

  const handleEditSubmit = async (data) => {
    console.log('Meal edited:', data);
    // Send data to backend for editing
    try {
      const response = await fetch(`http://localhost:5001/api/meals/${currentMeal._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchMealLogs(); // Wait for the fetch to complete
        handleCloseEditModal(); // Close the modal after successful edit
      } else {
        console.error('Failed to edit meal');
      }
    } catch (error) {
      console.error('Error editing meal:', error);
    }
  };

  const handleDeleteMeal = async () => {
    console.log(currentMeal._id)
    try {
      const response = await fetch(`http://localhost:5001/api/meals/${currentMeal._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchMealLogs(); // Refresh the meal logs
        handleCloseDeleteModal(); // Close the delete confirmation modal
      } else {
        console.error('Failed to delete meal');
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const fetchMealLogs = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/meals');
      const data = await response.json();
      setMealLogs(data); // Update the state with fetched meal logs
    } catch (error) {
      console.error('Error fetching meal logs:', error);
    }
  };

  useEffect(() => {
    fetchMealLogs(); // Fetch meal logs when the component mounts
  }, []);

   // Log currentMeal when it changes
   useEffect(() => {
    console.log("Current meal:", currentMeal);
  }, [currentMeal]);

  return (
    <div className="tracker-page">
      <button
        title="Add New"
        className="group cursor-pointer outline-none hover:rotate-90 duration-300"
        onClick={handleOpenModal}
      >
        <AiOutlinePlus size={50} className="stroke-zinc-400 fill-none group-hover:fill-zinc-800 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300" />
      </button>
      <MealLogForm 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleFormSubmit} 
      />
      <EditMealModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        meal={currentMeal}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteMeal}
        mealName={currentMeal?.foodItem}
      />
      <h2>Today's Meals</h2>
      <div className="meal-logs">
        {mealLogs.map((log, index) => (
          <div className="card" key={index}>
            <div className="card__title">{log.mealCategory}</div>
            <div className="card__data">
              <div className="card__left item">{log.foodItem}</div>
              <div className="card__right item">{log.nutrients} calories</div>
              <button onClick={() => handleOpenEditModal(log)}>Edit</button>
              <button onClick={() => handleOpenDeleteModal(log)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackerPage;
