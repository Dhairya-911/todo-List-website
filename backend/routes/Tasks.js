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
    
    // If user is admin, show all tasks. If regular user, show only their tasks
    if (req.user.role === 'admin') {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({ userId: req.user.id });
    }
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Add new task
router.post('/', async (req, res) => {
  try {
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
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Allow deletion if user is admin or task owner
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
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
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Allow updates if user is admin or task owner
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
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
