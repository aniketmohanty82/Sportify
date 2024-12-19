import React, { useEffect, useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBInput,
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import the local image
import registerImage from '../assets/register.jpg';

function Registration() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [message, setMessage]     = useState('');
  const [username, setUsername]   = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    import('mdb-react-ui-kit/dist/css/mdb.min.css');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://gastric-annaliese-purdueuniversitycollegeofscience-b16501fc.koyeb.app/users/register', {
        firstName,
        lastName,
        username,
        email,
        password,
      });
      setMessage(res.data.message);
      // Optionally redirect to login page
      navigate('/login');
    } catch (err) {
      setMessage(err.response.data.message || 'Registration failed');
    }
  };

  return (
    <MDBContainer
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      {/* Background Image */}
      <div
        className="p-5 bg-image"
        style={{
          backgroundImage: `url(${registerImage})`,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: '-1',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      <MDBCard
        className="mx-5 mb-5 p-5 shadow-5"
        style={{
          background: 'hsla(0, 0%, 100%, 0.6)',
          backdropFilter: 'blur(30px)',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        <MDBCardBody className="p-5 text-center">
          <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <h2 className="fw-bold mb-5">Sign up now</h2>
            <form onSubmit={handleSubmit}>
              <MDBRow>
                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="First name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </MDBCol>

                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Last name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </MDBCol>
              </MDBRow>

              <MDBInput
                wrapperClass="mb-4"
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <MDBInput
                wrapperClass="mb-4"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <MDBBtn
                className="w-100 mb-4"
                style={{ margin: '0 auto', backgroundColor: 'black', color: 'white' }}
                type="submit"
              >
                Sign Up
              </MDBBtn>
            </form>
            {message && <p>{message}</p>}
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Registration;