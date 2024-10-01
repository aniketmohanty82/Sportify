import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import MealLogForm from '../components/MealLogForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import EditMealModal from '../components/EditMealModal';
import '../App.css';
import '../MealLogs.css';

const TrackerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Sample meal logs
  const [mealLogs, setMealLogs] = useState([
    { foodItem: 'Oatmeal', portionSize: '1 cup', nutrients: 150, mealCategory: 'Breakfast' },
    { foodItem: 'Chicken Salad', portionSize: '200g', nutrients: 300, mealCategory: 'Lunch' },
    { foodItem: 'Grilled Salmon', portionSize: '150g', nutrients: 350, mealCategory: 'Dinner' },
    { foodItem: 'Apple', portionSize: '1 medium', nutrients: 95, mealCategory: 'Snacks' }
  ]);

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

  const handleFormSubmit = (data) => {
    setMealLogs([...mealLogs, data]);
    showSuccessMessage('Meal added successfully!'); // Success message
    handleCloseModal();
  };

  const handleEditSubmit = (updatedMeal) => {
    setMealLogs(mealLogs.map((meal) => (meal === currentMeal ? updatedMeal : meal)));
    showSuccessMessage('Meal edited successfully!'); // Success message
    handleCloseEditModal();
  };

  const handleDeleteMeal = () => {
    setMealLogs(mealLogs.filter((meal) => meal !== currentMeal));
    showSuccessMessage('Meal deleted successfully!'); // Success message
    handleCloseDeleteModal();
  };

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
        onSubmit={handleEditSubmit}
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
    </div>
  );
};

export default TrackerPage;
