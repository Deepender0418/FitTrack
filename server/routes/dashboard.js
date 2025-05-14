import express from 'express';
import auth from '../middleware/auth.js';
import Workout from '../models/Workout.js';
import Goal from '../models/Goal.js';
import Profile from '../models/Profile.js';

const router = express.Router();

// Get dashboard data
router.get('/', auth, async (req, res) => {
  try {
    // Get recent workouts (last 3)
    const recentActivities = await Workout.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(3);
    
    // Get active goals
    const goals = await Goal.find({ 
      user: req.user.id,
      completed: false 
    })
      .sort({ targetDate: 1 })
      .limit(5);
    
    // Get user profile stats
    const profile = await Profile.findOne({ user: req.user.id });
    
    // Calculate workouts this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const workoutsThisWeek = await Workout.countDocuments({
      user: req.user.id,
      date: { $gte: oneWeekAgo },
      completed: true
    });
    
    // Get stats
    const stats = {
      workoutsThisWeek,
      completedGoals: profile ? profile.stats.goalsAchieved : 0,
      streakDays: profile ? profile.stats.longestStreak : 0,
      caloriesBurned: profile ? profile.stats.totalMinutes * 5 : 0 // Rough estimate
    };
    
    res.json({
      recentActivities,
      goals,
      stats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;