import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MDBContainer, MDBInput, MDBBtn } from 'mdb-react-ui-kit';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate the token
    const validateToken = async () => {
      try {
        await axios.get(`http://localhost:5001/users/reset-password/${token}`);
        setIsValidToken(true);
      } catch (err) {
        console.error(err.response.data);
        setMessage(err.response.data.message || 'Invalid or expired token');
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`http://localhost:5001/users/reset-password/${token}`, { password });
      setMessage(res.data.message);
      // Optionally redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err.response.data);
      setMessage(err.response.data.message || 'Error resetting password');
    }
  };

  if (!isValidToken) {
    return (
      <MDBContainer className="d-flex flex-column align-items-center justify-content-center vh-100">
        <h3 className="fw-bold mb-3">Reset Password</h3>
        <p>{message}</p>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h3 className="fw-bold mb-3">Reset Password</h3>
      <form onSubmit={handleSubmit}>
        <MDBInput
          wrapperClass='mb-4'
          label='New Password'
          id='passwordInput'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <MDBBtn type="submit" color="primary">Reset Password</MDBBtn>
      </form>
      {message && <p>{message}</p>}
    </MDBContainer>
  );
};

export default ResetPassword;
