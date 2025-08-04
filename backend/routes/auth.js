const express = require('express');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const router = express.Router();

// Predefined users for demo purposes (will be migrated to database)
const demoUsers = [
  {
    id: "admin123",
    email: "admin@todo.com",
    password: "admin123",
    role: "admin",
    name: "Admin User"
  },
  {
    id: "user123",
    email: "user@todo.com", 
    password: "user123",
    role: "user",
    name: "Regular User"
  }
];

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists in database
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if email exists in demo users
    const demoUser = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (demoUser) {
      return res.status(400).json({ message: 'Email already exists in demo accounts' });
    }

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role: role === 'admin' ? 'admin' : 'user' // Only allow admin if explicitly set
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id.toString());

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: messages.join('. ') });
    } else {
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
});

// Login route (updated to support both demo users and registered users)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // First check demo users for backward compatibility
    const demoUser = demoUsers.find(u => u.email === email && u.password === password);
    
    if (demoUser) {
      const token = generateToken(demoUser.id);
      return res.json({ 
        token,
        user: {
          id: demoUser.id,
          email: demoUser.email,
          role: demoUser.role,
          name: demoUser.name
        }
      });
    }

    // Check registered users in database
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user info
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'defaultsecret');
    
    // Check demo users first
    const demoUser = demoUsers.find(u => u.id === decoded.id);
    if (demoUser) {
      return res.json({
        id: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
        name: demoUser.name
      });
    }

    // Check registered users
    const user = await User.findById(decoded.id);
    
    if (user) {
      res.json({
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
