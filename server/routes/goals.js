import express from 'express';
import auth from '../middleware/auth.js';
import Goal from '../models/Goal.js';
import Profile from '../models/Profile.js';

const router = express.Router();

// Get all goals for the current user
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ targetDate: 1 });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single goal
router.get('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    // Check if goal belongs to the user
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new goal
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, targetDate, category, progress, completed } = req.body;
    
    const newGoal = new Goal({
      user: req.user.id,
      title,
      description,
      targetDate,
      category,
      progress: progress || 0,
      completed: completed || false
    });
    
    const goal = await newGoal.save();
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a goal
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, targetDate, category, progress, completed } = req.body;
    
    let goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    // Check if goal belongs to the user
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Check if goal was previously completed
    const wasCompleted = goal.completed;
    
    // Update goal fields
    const goalFields = {
      title,
      description,
      targetDate,
      category,
      progress,
      completed
    };
    
    // Update goal
    goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $set: goalFields },
      { new: true }
    );
    
    // Update user profile stats if completed status changed
    if (!wasCompleted && completed) {
      await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $inc: { 'stats.goalsAchieved': 1 } }
      );
    } else if (wasCompleted && !completed) {
      await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $inc: { 'stats.goalsAchieved': -1 } }
      );
    }
    
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle goal completion status
router.put('/:id/toggle-complete', auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    // Check if goal belongs to the user
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Toggle completed status
    goal.completed = !goal.completed;
    
    // If completing, set progress to 100%
    if (goal.completed) {
      goal.progress = 100;
    }
    
    await goal.save();
    
    // Update user profile stats
    const statsUpdate = goal.completed
      ? { $inc: { 'stats.goalsAchieved': 1 } }
      : { $inc: { 'stats.goalsAchieved': -1 } };
    
    await Profile.findOneAndUpdate({ user: req.user.id }, statsUpdate);
    
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    // Check if goal belongs to the user
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Decrement stats if goal was completed
    if (goal.completed) {
      await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $inc: { 'stats.goalsAchieved': -1 } }
      );
    }
    
    await goal.remove();
    res.json({ message: 'Goal removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;