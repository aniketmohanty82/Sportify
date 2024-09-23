import React, { useState, useEffect } from 'react';
import MealLogForm from '../components/MealLogForm'; // Import the MealLogForm component
import '../App.css'; // Import the CSS file for styling

const TrackerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealLogs, setMealLogs] = useState([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
        // Fetch meal logs again after successful submission
        await fetchMealLogs(); // Wait for the fetch to complete
        handleCloseModal(); // Close the modal after successful submission
      } else {
        console.error('Failed to log meal');
      }
    } catch (error) {
      console.error('Error logging meal:', error);
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

  return (
    <div className="tracker-page">
      <button className="btn" onClick={handleOpenModal}>Log a Meal</button>
      <MealLogForm 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleFormSubmit} 
      />
      {/* Render meal logs in a table */}
      <table>
        <thead>
          <tr>
            <th>Food Item</th>
            <th>Meal Category</th>
            <th>Nutrients</th>
            <th>Portion Size</th>
          </tr>
        </thead>
        <tbody>
          {mealLogs.map((log, index) => (
            <tr key={index}>
              <td>{log.foodItem}</td>
              <td>{log.mealCategory}</td>
              <td>{log.nutrients}</td>
              <td>{log.portionSize}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackerPage;
