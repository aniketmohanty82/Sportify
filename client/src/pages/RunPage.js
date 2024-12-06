/*Sportify/client/src/pages/RunPage.js*/

import React, { useState, useEffect } from 'react';
import RunLogForm from '../components/RunLogForm';
import ConfirmDeleteRunModal from '../components/ConfirmDeleteRunModal';
import EditRunModal from '../components/EditRunModal';
import { AiOutlinePlus } from 'react-icons/ai';
import RunDistanceChart from '../components/RunDistanceChart';
import SpeedGraph from '../components/SpeedGraph';
import '../RunLogStyles.css';
import '../App.css';

const RunPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [runs, setRuns] = useState([]);
  const [currentRun, setCurrentRun] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [timeFrame, setTimeFrame] = useState('week');
  const [darkMode, setDarkMode] = useState(false);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const fetchDarkModeSetting = async () => {
    try {
      const response = await fetch(`https://sportifyapp.onrender.com/users/darkMode?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Remove 'x-auth-token' if authentication is removed
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch dark mode setting');
      }
      const data = await response.json();
      setDarkMode(data.darkMode);
    } catch (error) {
      console.error('Error fetching dark mode setting:', error);
    }
  };
  
  // Fetch runs data from the backend
  const fetchRuns = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch('https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/api/runs', {
        headers: { 'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjcyMTdjYzRhZjZkOTg0NGVkZjEwMDkyIn0sImlhdCI6MTczMzQ3OTU0MywiZXhwIjoxNzMzNDgzMTQzfQ.Bsc1W4K1MsS6Cmw6316cHN32w2HH42Ug6bENKurFEz0' },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching runs: ${errorText}`);
      }

      const runData = await response.json();
      setRuns(runData);
    } catch (error) {
      console.error('Error fetching runs:', error.message);
      setFetchError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Log a new run
  const logRun = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch('http://localhost:5001/api/runs/logrun', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error logging run: ${errorText}`);
      }

      fetchRuns(); // Refresh data
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error logging run:', error.message);
      alert(error.message);
    }
  };

  // Edit a run
  const editRun = async (updatedRun) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/runs/${updatedRun._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(updatedRun),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating run: ${errorText}`);
      }

      fetchRuns(); // Refresh data after successful edit
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating run:', error.message);
      alert(error.message);
    }
  };

  const deleteRun = async (runId) => {
    console.log("Attempting to delete run with ID:", runId); // Check if the correct ID is being passed
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/runs/${runId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error deleting run: ${errorText}`);
      }
  
      fetchRuns(); // Refresh the list of runs
      setIsEditModalOpen(false); // Close the edit modal after deletion
    } catch (error) {
      console.error('Error deleting run:', error.message);
      alert(error.message);
    }
  };  

  useEffect(() => {
    fetchRuns();
    fetchDarkModeSetting()
  }, []);

  const filterRunsByTimeFrame = (runs, timeFrame) => {
    const now = new Date();
    let startDate;

    switch (timeFrame) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        return runs;
    }

    return runs.filter(run => new Date(run.date) >= startDate);
  };

  const filteredRuns = filterRunsByTimeFrame(runs, timeFrame);

  return (
    <div className={`tracker-page ${darkMode ? 'dark-mode' : ''}`}>
      {/* Date and Add Run Button */}
      <div className="header-section">
        <h2 className="current-date">{new Date().toLocaleDateString()}</h2>
        <button
          title="Add New"
          onClick={() => setIsFormOpen(true)}
          className="add-run-button"
        >
          <AiOutlinePlus size={24} />
          <span>Add a run</span>
        </button>
      </div>

      {/* Graph Container */}
      <div className="graph-container">
        {/* Time Frame Selector */}
        <div className="time-frame-selector">
          <label htmlFor="timeFrame">Select Time Frame:</label>
          <select
            id="timeFrame"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Graphs Section */}
        <div className="graphs-section">
          <div className="graph">
            <RunDistanceChart runs={filteredRuns} darkMode={darkMode} />
          </div>
          <div className="graph">
            <SpeedGraph runs={filteredRuns} darkMode={darkMode} />
          </div>
        </div>
      </div>

      {/* Run Logs Table */}
      <div className="run-logs-section">
        <h2>Run Logs</h2>

        {isLoading ? (
          <p>Loading runs...</p>
        ) : fetchError ? (
          <p className="error-message">{fetchError}</p>
        ) : (
          <table className="run-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Duration (min)</th>
                <th>Distance (km)</th>
              </tr>
            </thead>
            <tbody>
              {runs.length > 0 ? (
                runs.map((run) => (
                  <tr
                    key={run._id}
                    className="run-row"
                    onClick={() => {
                      setCurrentRun(run);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <td>{new Date(run.date).toLocaleDateString()}</td>
                    <td>{run.duration}</td>
                    <td>{run.distance}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    No runs logged yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      <RunLogForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={logRun}
        darkMode={darkMode}
      />
      <EditRunModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={editRun}
        onDelete={deleteRun}
        run={currentRun}
      />
      <ConfirmDeleteRunModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteRun(currentRun._id)}
      />
    </div>
  );
};

export default RunPage;