import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  stats: {
    workoutsCompleted: {
      type: Number,
      default: 0
    },
    goalsAchieved: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    totalMinutes: {
      type: Number,
      default: 0
    }
  },
  measurements: {
    weight: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    restingHeartRate: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    weightUnit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'lbs'
    },
    heightUnit: {
      type: String,
      enum: ['cm', 'ft'],
      default: 'cm'
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    }
  }
});

export default mongoose.model('Profile', ProfileSchema);