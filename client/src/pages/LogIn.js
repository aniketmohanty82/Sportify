import React, { useEffect } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';

import loginImage from '../assets/home_pic.jpg'

const LogIn = () => {
  useEffect(() => {
    // Dynamically import the MDB CSS file when the component is mounted
    import('mdb-react-ui-kit/dist/css/mdb.min.css');
  }, []); // Empty dependency array ensures this only runs once when the component mounts

  return (
    <MDBContainer fluid className="d-flex align-items-center vh-100">
      <MDBRow className="w-100 justify-content-center">

        <MDBCol md='6' className="d-flex flex-column align-items-center justify-content-center">
          <div className='d-flex flex-column justify-content-center w-75 pt-4'>
          <h3 className="fw-bold mb-3 ps-5 pb-3 text-center" style={{ letterSpacing: '1px' }}>Log in</h3>


            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Email address' id='formControlLg' type='email' size="lg" />
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Password' id='formControlLg' type='password' size="lg" />

            <MDBBtn className="mb-4 px-5 mx-5 w-100" size='lg' style={{ backgroundColor: 'black', color: 'white' }}>
              Login
            </MDBBtn>
            
            <p className="small mb-5 pb-lg-3 ms-5">
              <a className="text-muted" href="#!">Forgot password?</a>
            </p>
            
            <p className='ms-5'>
              Don't have an account? <a href="#!" className="link-info">Register here</a>
            </p>
          </div>
        </MDBCol>

        <MDBCol md='6' className='d-none d-md-block px-0'>
          <img src={loginImage}
            alt="Login image" className="w-100 vh-100" style={{ objectFit: 'cover', objectPosition: 'left' }} />
        </MDBCol>

      </MDBRow>
    </MDBContainer>
  );
}

export default LogIn;
