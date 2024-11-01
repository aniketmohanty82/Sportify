// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import TrackerPage from './pages/Tracker';
import Navbar from './components/Navbar';
import LogIn from './pages/LogIn';
import Registration from './pages/Registration';
import Sports from './pages/Sports';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import Workout from './pages/Workout';
import RunPage from './pages/RunPage';
import EditAccount from './pages/EditAccount';
import AccountDeleted from './pages/AccountDeleted'; // Import the AccountDeleted component

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();

  const hideNavbarPaths = ['/login', '/register', '/account-deleted'];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div style={{ display: 'flex' }}>
      {!shouldHideNavbar && <Navbar />}
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/tracker"
            element={
              <ProtectedRoute>
                <TrackerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sports"
            element={
              <ProtectedRoute>
                <Sports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/runs"
            element={
              <ProtectedRoute>
                <RunPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout"
            element={
              <ProtectedRoute>
                <Workout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-account"
            element={
              <ProtectedRoute>
                <EditAccount />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account-deleted" // Added route for account deletion confirmation
            element={<AccountDeleted />}
          />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
