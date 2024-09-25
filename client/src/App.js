import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './Home';
import TrackerPage from './pages/Tracker';
import Navbar from './components/Navbar';
import LogIn from './pages/LogIn';
import Registration from './pages/Registration';

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();

  // Define paths where the Navbar should be hidden
  const hideNavbarPaths = ['/login', '/register'];

  // Check if the current path is in the hideNavbarPaths array
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div style={{ display: 'flex' }}>
      {!shouldHideNavbar && <Navbar />}
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Registration />}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;
