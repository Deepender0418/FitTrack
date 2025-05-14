import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

const router = express.Router();

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      // Create a default profile if none exists
      const user = await User.findById(req.user.id);
      
      profile = new Profile({
        user: req.user.id,
        name: user.name,
        email: user.email,
        joinDate: user.createdAt,
        stats: {
          workoutsCompleted: 0,
          goalsAchieved: 0,
          longestStreak: 0,
          totalMinutes: 0
        },
        measurements: {
          weight: 0,
          height: 0,
          restingHeartRate: 0
        },
        preferences: {
          weightUnit: 'lbs',
          heightUnit: 'cm',
          notificationsEnabled: true
        }
      });
      
      await profile.save();
    }
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      name,
      email,
      weight,
      height,
      restingHeartRate,
      weightUnit,
      heightUnit,
      notificationsEnabled
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (name) profileFields.name = name;
    if (email) profileFields.email = email;
    
    // Build measurements object
    profileFields.measurements = {};
    if (weight) profileFields.measurements.weight = weight;
    if (height) profileFields.measurements.height = height;
    if (restingHeartRate) profileFields.measurements.restingHeartRate = restingHeartRate;
    
    // Build preferences object
    profileFields.preferences = {};
    if (weightUnit) profileFields.preferences.weightUnit = weightUnit;
    if (heightUnit) profileFields.preferences.heightUnit = heightUnit;
    if (notificationsEnabled !== undefined) profileFields.preferences.notificationsEnabled = notificationsEnabled;

    // Update or create profile
    let profile = await Profile.findOne({ user: req.user.id });
    
    if (profile) {
      // Update profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      
      // Also update name and email in User model if changed
      if (name || email) {
        const updateFields = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        
        await User.findByIdAndUpdate(req.user.id, updateFields);
      }
    } else {
      // Create profile
      profile = new Profile(profileFields);
      await profile.save();
    }
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;