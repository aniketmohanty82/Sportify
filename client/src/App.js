import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tracker from './pages/Tracker';
import Home from './Home'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracker" element={<Tracker />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
