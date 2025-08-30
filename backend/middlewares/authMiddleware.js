import Users from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    console.log('=== PROTECT MIDDLEWARE START ===');
    console.log('Headers:', req.headers);

    let token = req.headers.authorization;
    console.log('Raw token:', token);

    if (token && token.startsWith('Bearer')) {
      token = token.split(' ')[1];
      console.log('Extracted token:', token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      console.log('Querying user with ID:', decoded.id);
      req.user = await Users.findById(decoded.id).select('-password');
      console.log('User found:', req.user ? 'YES' : 'NO');
      console.log('User data:', req.user);

      console.log('=== PROTECT MIDDLEWARE SUCCESS ===');
      next();
    } else {
      console.log('No valid token found');
      res.status(401).json({ message: 'Not Authorized, no Token Found' });
    }
  } catch (error) {
    console.error('=== PROTECT MIDDLEWARE ERROR ===');
    console.error('Error details:', error);
    res.status(401).json({
      message: 'Token Failed',
      error: error.message,
    });
  }
};
