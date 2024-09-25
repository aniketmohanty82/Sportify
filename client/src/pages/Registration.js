import React, { useEffect } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBInput
} from 'mdb-react-ui-kit';

// Import the local image
import registerImage from '../assets/register.jpg';

function Registration() {

  useEffect(() => {
    // Dynamically import the MDB CSS file when the component is mounted
    import('mdb-react-ui-kit/dist/css/mdb.min.css');
  }, []); // Empty dependency array ensures this only runs once when the component mounts

  return (
    <MDBContainer fluid className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>

      {/* Use the local image in the background */}
      <div className="p-5 bg-image" style={{
        backgroundImage: `url(${registerImage})`, 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100vh', 
        zIndex: '-1', 
        backgroundSize: 'cover',  // Ensure the image covers the entire area
        backgroundPosition: 'center'  // Center the image
      }}>
      </div>

      <MDBCard className='mx-5 mb-5 p-5 shadow-5' style={{
        background: 'hsla(0, 0%, 100%, 0.6)',  // Reduced alpha value for slight transparency
        backdropFilter: 'blur(30px)', 
        maxWidth: '600px', 
        width: '100%'
      }}>
        <MDBCardBody className='p-5 text-center'>
          <div style={{fontFamily: 'Arial, sans-serif'}}>
          <h2 className="fw-bold mb-5">Sign up now</h2>

          <MDBRow>
            <MDBCol col='6'>
              <MDBInput wrapperClass='mb-4' label='First name' type='text' />
            </MDBCol>

            <MDBCol col='6'>
              <MDBInput wrapperClass='mb-4' label='Last name' type='text' />
            </MDBCol>
          </MDBRow>

          <MDBInput wrapperClass='mb-4' label='Email' type='email' />
          <MDBInput wrapperClass='mb-4' label='Password' type='password' />

          <MDBBtn className='w-100 mb-4' style={{ margin: '0 auto', backgroundColor: 'black', color: 'white' }}>sign up</MDBBtn>
          </div>
        </MDBCardBody>
      </MDBCard>

    </MDBContainer>
  );
}

export default Registration;
