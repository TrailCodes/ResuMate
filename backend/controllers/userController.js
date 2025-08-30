import Users from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//generate a token jwt

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Check for Duplicate User
    const userExist = await Users.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: 'User Already Exist' });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password is less than 8 characters',
      });
    }
    // HASHING PASSWORD

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //CREATE A USER

    const user = await Users.create({
      name,
      email,
      password: hashPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

//LOGIN FUNCTION

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(500).json({ message: 'Invalid User or password' });
    }

    // Compare Password

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).json({ message: 'Invalid User or password' });
    }

    //login succesful

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    console.log('=== GET USER PROFILE START ===');
    console.log('req.user:', req.user);

    if (!req.user) {
      console.log('No user found in request');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Sending user profile response');
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('=== GET USER PROFILE ERROR ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    return res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};
