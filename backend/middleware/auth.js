// // middleware/auth.js
// const jwt = require('jsonwebtoken');

// function auth(req, res, next) {
//   const token = req.header('Authorization')?.split(' ')[1]; // Expecting 'Bearer <token>'

//   if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Add user info to request object
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// }

// module.exports = auth;