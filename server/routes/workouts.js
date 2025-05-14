import express from 'express';
import auth from '../middleware/auth.js';
import Workout from '../models/Workout.js';
import Profile from '../models/Profile.js';

const router = express.Router();

// Get all workouts for the current user
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single workout
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    // Check if workout belongs to the user
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new workout
router.post('/', auth, async (req, res) => {
  try {
    const { title, date, duration, exercises, notes, type, completed } = req.body;
    
    const newWorkout = new Workout({
      user: req.user.id,
      title,
      date,
      duration,
      exercises,
      notes,
      type,
      completed: completed || false
    });
    
    const workout = await newWorkout.save();
    
    // Update user profile stats if workout is completed
    if (completed) {
      await Profile.findOneAndUpdate(
        { user: req.user.id },
        { 
          $inc: { 
            'stats.workoutsCompleted': 1,
            'stats.totalMinutes': duration
          }
        }
      );
    }
    
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a workout
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, date, duration, exercises, notes, type, completed } = req.body;
    
    let workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    // Check if workout belongs to the user
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Update workout fields
    const workoutFields = {
      title,
      date,
      duration,
      exercises,
      notes,
      type,
      completed
    };
    
    // Update workout
    workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { $set: workoutFields },
      { new: true }
    );
    
    // Update user profile stats if completed status changed
    if (completed !== workout.completed) {
      const statsUpdate = completed
        ? { 
            $inc: { 
              'stats.workoutsCompleted': 1,
              'stats.totalMinutes': duration
            }
          }
        : { 
            $inc: { 
              'stats.workoutsCompleted': -1,
              'stats.totalMinutes': -duration
            }
          };
      
      await Profile.findOneAndUpdate({ user: req.user.id }, statsUpdate);
    }
    
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle workout completion status
router.put('/:id/toggle-complete', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    // Check if workout belongs to the user
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Toggle completed status
    workout.completed = !workout.completed;
    await workout.save();
    
    // Update user profile stats
    const statsUpdate = workout.completed
      ? { 
          $inc: { 
            'stats.workoutsCompleted': 1,
            'stats.totalMinutes': workout.duration
          }
        }
      : { 
          $inc: { 
            'stats.workoutsCompleted': -1,
            'stats.totalMinutes': -workout.duration
          }
        };
    
    await Profile.findOneAndUpdate({ user: req.user.id }, statsUpdate);
    
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    // Check if workout belongs to the user
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Decrement stats if workout was completed
    if (workout.completed) {
      await Profile.findOneAndUpdate(
        { user: req.user.id },
        { 
          $inc: { 
            'stats.workoutsCompleted': -1,
            'stats.totalMinutes': -workout.duration
          }
        }
      );
    }
    
    await workout.remove();
    res.json({ message: 'Workout removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;