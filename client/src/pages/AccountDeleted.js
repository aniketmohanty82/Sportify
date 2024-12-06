// src/pages/AccountDeleted.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../AccountDeleted.css';

const AccountDeleted = () => {
  return (
    <div className="account-deleted-container">
      <h2>Account Deleted</h2>
      <p>Your account has been permanently deleted. We're sorry to see you go.</p>
      <Link to="/" className="button return-home">
        Return to Home
      </Link>
    </div>
  );
};

export default AccountDeleted;
