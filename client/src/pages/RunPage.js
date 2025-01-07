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
  const [isRunDropdownOpen, setIsRunDropdownOpen] = useState(false);
  const [runFormat, setRunFormat] = useState('');

  const fetchDarkModeSetting = async () => {
    try {
      const response = await fetch(`http://localhost:5001/users/darkMode?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Include token if authentication is needed
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dark mode setting');
      }

      const data = await response.json();
      setDarkMode(data.darkMode);
      console.log(darkMode)
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

      const response = await fetch('http://localhost:5001/api/runs', {
        headers: { 'x-auth-token': token },
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

  const handleExport = async (type, format) => {
    if (!format) {
      alert(`Please select a format for ${type} export.`);
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/workouts/export?type=${type}&format=${format}`, {
        headers: {
          'x-auth-token': token,
        },
      });
  
      if (!response.ok) throw new Error('Failed to export');
  
      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', `${type}_summary.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Error exporting ${type} summary:`, error);
      alert(`Failed to export ${type} summary`);
    }
  };  

  return (
    <div className={`tracker-page ${darkMode ? 'dark-mode' : ''}`}>
      {/* Add Run and Export Run Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 25px', // Adjusted padding for better spacing
          borderRadius: '10px',
          backgroundColor: '#fff',
          marginBottom: '20px', // Added spacing below the section
        }}
      >
        {/* Add Run Button */}
        <button
          title="Add New"
          onClick={() => setIsFormOpen(true)}
          style={{
            backgroundColor: '#1aa64b',
            color: '#fff',
            padding: '12px 18px', // Slightly larger padding for comfortable interaction
            borderRadius: '10px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <AiOutlinePlus size={24} />
          <span style={{ marginLeft: '10px' }}>Add a run</span>
        </button>
  
        {/* Export Run Section */}
        <div style={{ position: 'relative' }}>
          <button
            title="Export Run"
            style={{
              backgroundColor: '#1aa64b',
              color: '#fff',
              padding: '12px 18px', // Matching padding with Add Run button
              borderRadius: '10px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            onClick={() => setIsRunDropdownOpen(!isRunDropdownOpen)}
          >
            Export Run
          </button>
  
          {/* Export Dropdown */}
          {isRunDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '55px', // Adjusted position for better spacing
                right: '0',
                backgroundColor: '#fff',
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.15)',
                borderRadius: '10px',
                padding: '12px', // More consistent padding inside the dropdown
                zIndex: 10,
              }}
            >
              <label style={{ marginBottom: '8px', display: 'block' }}>
                Select Format
              </label>
              <select
                value={runFormat}
                onChange={(e) => setRunFormat(e.target.value)}
                style={{
                  padding: '8px', 
                  width: '100%',
                  marginBottom: '10px', // Added margin for spacing
                }}
              >
                <option value="">-- Select Format --</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
  
              <button
                onClick={() => {
                  handleExport('run', runFormat);
                  setIsRunDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px', // More prominent button
                  backgroundColor: '#1aa64b',
                  color: '#fff',
                  borderRadius: '5px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Download
              </button>
            </div>
          )}
        </div>
      </div>
  
      {/* Graph Container */}
      <div className="graph-container" style={{ padding: '20px' }}> {/* Added padding for the container */}
        {/* Time Frame Selector */}
        <div className="time-frame-selector" style={{ marginBottom: '20px' }}>
          <label htmlFor="timeFrame" style={{ marginRight: '10px' }}>
            Select Time Frame:
          </label>
          <select
            id="timeFrame"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '5px',
            }}
          >
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
  
        {/* Graphs Section */}
        <div className="graphs-section" style={{ display: 'flex', gap: '20px' }}>
          <div className="graph" style={{ flex: 1, padding: '15px' }}>
            <RunDistanceChart runs={filteredRuns} darkMode={darkMode} />
          </div>
          <div className="graph" style={{ flex: 1, padding: '15px' }}>
            <SpeedGraph runs={filteredRuns} darkMode={darkMode} />
          </div>
        </div>
      </div>
  
      {/* Run Logs Table */}
      <div className="run-logs-section" style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>Run Logs</h2>
        {isLoading ? (
          <p>Loading runs...</p>
        ) : fetchError ? (
          <p className="error-message">{fetchError}</p>
        ) : (
          <table className="run-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Duration (min)</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Distance (km)</th>
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
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ padding: '10px' }}>{new Date(run.date).toLocaleDateString()}</td>
                    <td style={{ padding: '10px' }}>{run.duration}</td>
                    <td style={{ padding: '10px' }}>{run.distance}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>
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