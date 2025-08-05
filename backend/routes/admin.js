const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const protect = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Admin-only route to get all users with their tasks
router.get('/users-with-tasks', async (req, res) => {
  try {
    // Check if user is admin (for both demo users and registered users)
    const isAdmin = req.user.role === 'admin' || req.user.id === 'admin123';
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Get all registered users from database
    const registeredUsers = await User.find({}, 'name email role createdAt');
    
    // Get demo users info
    const demoUsers = [
      {
        _id: 'admin123',
        name: 'Admin User',
        email: 'admin@todo.com',
        role: 'admin',
        createdAt: new Date('2024-01-01'),
        isDemo: true
      },
      {
        _id: 'user123',
        name: 'Regular User',
        email: 'user@todo.com',
        role: 'user',
        createdAt: new Date('2024-01-01'),
        isDemo: true
      }
    ];

    // Combine all users
    const allUsers = [
      ...demoUsers,
      ...registeredUsers.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        isDemo: false
      }))
    ];

    // Get all tasks
    const allTasks = await Task.find({});

    // Group tasks by user
    const usersWithTasks = allUsers.map(user => {
      const userTasks = allTasks.filter(task => 
        task.userId === user._id.toString() || task.userId === user._id
      );
      
      return {
        ...user,
        tasks: userTasks,
        taskCount: userTasks.length,
        completedTasks: userTasks.filter(task => task.completed).length
      };
    });

    res.json(usersWithTasks);

  } catch (error) {
    console.error('Error fetching users with tasks:', error);
    res.status(500).json({ message: 'Error fetching users and tasks' });
  }
});

// Get user statistics for admin dashboard
router.get('/stats', async (req, res) => {
  try {
    // Check if user is admin
    const isAdmin = req.user.role === 'admin' || req.user.id === 'admin123';
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const totalRegisteredUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    const pendingTasks = totalTasks - completedTasks;

    res.json({
      totalUsers: totalRegisteredUsers + 2, // +2 for demo users
      totalRegisteredUsers,
      totalDemoUsers: 2,
      totalTasks,
      completedTasks,
      pendingTasks
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

module.exports = router;
