import React, { useEffect, useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import loginImage from '../assets/home_pic.jpg';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const LogIn = () => {
  useEffect(() => {
    import('mdb-react-ui-kit/dist/css/mdb.min.css');
  }, []);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5001/users/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);  // Store the user ID
      localStorage.setItem('userName', res.data.user.userName);
      localStorage.setItem('timeZone', res.data.user.timeZone);
      console.log(res.data.user)
      console.log(localStorage.getItem('userName'))

      navigate('/tracker');

    } catch (err) {
      console.error(err.response.data);
      setMessage(err.response.data.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5001/users/google-login', {
        token: credentialResponse.credential,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userName', res.data.user.userName);
      localStorage.setItem('timeZone', res.data.user.timeZone);
      localStorage.setItem('darkMode', res.data.user.darkMode);

      navigate('/tracker');
    } catch (err) {
      console.error(err);
      setMessage('Google login failed');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error(error);
    setMessage('Google login failed');
  };

  return (
    <GoogleOAuthProvider clientId={'561537019638-8r5obepso26lld6cn7dq51o4334qs1g5.apps.googleusercontent.com'}>
      <MDBContainer fluid className="d-flex align-items-center vh-100">
        <MDBRow className="w-100 justify-content-center">

          <MDBCol md='6' className="d-flex flex-column align-items-center justify-content-center">
            <div className='d-flex flex-column justify-content-center w-75 pt-4'>
              <h3 className="fw-bold mb-3 ps-5 pb-3 text-center" style={{ letterSpacing: '1px' }}>Log in</h3>

              <form onSubmit={handleLogin}>
                <MDBInput
                  wrapperClass='mb-4 mx-5 w-100'
                  label='Email address'
                  id='formControlLg'
                  type='email'
                  size="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MDBInput
                  wrapperClass='mb-4 mx-5 w-100'
                  label='Password'
                  id='formControlLg'
                  type='password'
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <MDBBtn
                  className="mb-4 px-5 mx-5 w-100"
                  size='lg'
                  style={{ backgroundColor: 'black', color: 'white' }}
                  type="submit"
                >
                  Login
                </MDBBtn>
              </form>

              {message && <p>{message}</p>}

              <div className="mb-3 mx-5 w-100">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                />
              </div>

              <p className='ms-5'>
                Don't have an account? <a href="/register" className="link-info">Register here</a>
              </p>

              <p className="small mb-5 pb-lg-3 ms-5">
                <a className="text-muted" href="/forgot-password">Forgot password?</a>
              </p>

            </div>
          </MDBCol>

          <MDBCol md='6' className='d-none d-md-block px-0'>
            <img src={loginImage}
              alt="Login"
              className="w-100 vh-100"
              style={{ objectFit: 'cover', objectPosition: 'left' }}
            />
          </MDBCol>

        </MDBRow>
      </MDBContainer>
    </GoogleOAuthProvider>
  );
};

export default LogIn;