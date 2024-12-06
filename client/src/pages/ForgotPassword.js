import React, { useState } from 'react';
import axios from 'axios';
import { MDBContainer, MDBInput, MDBBtn } from 'mdb-react-ui-kit';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/users/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err.response.data);
      setMessage(err.response.data.message || 'Error sending password reset email');
    }
  };

  return (
    <MDBContainer className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h3 className="fw-bold mb-3">Reset Password</h3>
      <p>Enter your email address, and we'll send you a link to reset your password.</p>
      <form onSubmit={handleSubmit}>
        <MDBInput
          wrapperClass='mb-4'
          label='Email address'
          id='emailInput'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <MDBBtn type="submit" color="primary">Send Reset Link</MDBBtn>
      </form>
      {message && <p>{message}</p>}
    </MDBContainer>
  );
};

export default ForgotPassword;
