import React, { useState } from 'react';
import MealLogForm from '../components/MealLogForm'; // Import the MealLogForm component
import '../App.css'; // Import the CSS file for styling

const TrackerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (data) => {
    console.log('Meal logged:', data);
    // Handle the form submission (e.g., save data to a server or state)
  };

  return (
    <div className="tracker-page">
      <button className="btn" onClick={handleOpenModal}>Log a Meal</button>
      <MealLogForm 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleFormSubmit} 
      />
      {/* Render other components or content for the tracker page */}
    </div>
  );
};

export default TrackerPage;