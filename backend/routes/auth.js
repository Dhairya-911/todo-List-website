const express = require('express');
const generateToken = require('../utils/generateToken');
const router = express.Router();

// Predefined users for demo purposes
const users = [
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

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Find user by email and password
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    const token = generateToken(user.id);
    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Get current user info
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'defaultsecret');
    const user = users.find(u => u.id === decoded.id);
    
    if (user) {
      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
