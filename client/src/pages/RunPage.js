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
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(updatedRun),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating run: ${errorText}`);
      }

      fetchRuns();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating run:', error.message);
      alert(error.message);
    }
  };

  // Delete a run
  const deleteRun = async (runId) => {
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

      fetchRuns();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting run:', error.message);
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchRuns();
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
    <div className="tracker-page">
      {/* Date and Add Run Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px 20px', borderRadius: '15px', backgroundColor: '#f9f9f9', boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)' }}>
        <h2 style={{ fontSize: '24px', color: '#333', fontFamily: 'Open Sans, sans-serif' }}>{new Date().toLocaleDateString()}</h2>
        <button
          title="Add New"
          onClick={() => setIsFormOpen(true)}
          style={{ backgroundColor: '#1aa64b', color: '#fff', padding: '10px 15px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
        >
          <AiOutlinePlus size={24} />
          <span style={{ marginLeft: '8px' }}>Add a run</span>
        </button>
      </div>

      {/* Time Frame Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)} style={{ padding: '10px', fontSize: '16px', borderRadius: '5px' }}>
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Graphs Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <RunDistanceChart runs={filteredRuns} />
        </div>
        <div style={{ flex: 1 }}>
          <SpeedGraph runs={filteredRuns} />
        </div>
      </div>

      {/* Run Logs Table */}
      <div style={{ padding: '20px', borderRadius: '15px', backgroundColor: '#f9f9f9', boxShadow: '0 0 8px rgba(26, 166, 75, 0.4)' }}>
        <h2 style={{ marginBottom: '10px' }}>Run Logs</h2>
        
        {isLoading ? (
          <p>Loading runs...</p>
        ) : fetchError ? (
          <p style={{ color: 'red' }}>{fetchError}</p>
        ) : (
          <table className="run-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Duration (min)</th>
                <th style={{ padding: '10px' }}>Distance (km)</th>
              </tr>
            </thead>
            <tbody>
              {runs.length > 0 ? (
                runs.map((run) => (
                  <tr key={run._id} onClick={() => { setCurrentRun(run); setIsEditModalOpen(true); }} style={{ cursor: 'pointer', transition: 'background-color 0.3s', padding: '10px' }}>
                    <td>{new Date(run.date).toLocaleDateString()}</td>
                    <td>{run.duration}</td>
                    <td>{run.distance}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>No runs logged yet</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      <RunLogForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={logRun} />
      <EditRunModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSubmit={editRun} run={currentRun} />
      <ConfirmDeleteRunModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => deleteRun(currentRun._id)} />
    </div>
  );
};

export default RunPage;
