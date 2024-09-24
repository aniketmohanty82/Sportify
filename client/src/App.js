import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import TrackerPage from './pages/Tracker';
import Navbar from './components/Navbar'; // Import Navbar

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Navbar />
        <div style={{ flex: 1, padding: '20px' }}> {/* This will take the remaining space */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tracker" element={<TrackerPage />} />
            {/* Add more routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
