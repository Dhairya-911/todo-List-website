const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const protect = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Get all tasks
router.get('/', async (req, res) => {
  try {
    let tasks;
    
    // If user is admin, show all tasks with user info. If regular user, show only their tasks
    if (req.user.role === 'admin') {
      tasks = await Task.find().sort({ createdAt: -1 });
      // Add user information to each task for admin view
      tasks = tasks.map(task => ({
        ...task.toObject(),
        user: task.userId, // Keep the userId for frontend comparison
        userRole: 'user' // Default role for tasks
      }));
    } else {
      tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    }
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Add new task
router.post('/', async (req, res) => {
  try {
    // Prevent admins from creating tasks
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot create tasks' });
    }
    
    const newTask = new Task({
      ...req.body,
      userId: req.user.id // Associate task with the authenticated user
    });
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    // Prevent admins from deleting tasks
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot delete tasks' });
    }
    
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Only task owner can delete their tasks
    if (task.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Toggle/Update task
router.put('/:id', async (req, res) => {
  try {
    // Prevent admins from updating tasks
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot update tasks' });
    }
    
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Only task owner can update their tasks
    if (task.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

module.exports = router;
