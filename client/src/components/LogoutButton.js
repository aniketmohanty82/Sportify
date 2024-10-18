// // components/LogoutButton.js
// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const LogoutButton = () => {
//   const navigate = useNavigate(); // Updated hook

//   const handleLogout = () => {
//     // Clear user authentication data
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');

//     // Redirect to the login page
//     navigate('/login'); // Updated navigation
//   };

//   return (
//     <button onClick={handleLogout}>
//       Logout
//     </button>
//   );
// };

// export default LogoutButton;