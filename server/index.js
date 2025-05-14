  import express from 'express';
  import cors from 'cors';
  import mongoose from 'mongoose';
  import dotenv from 'dotenv';
  import cookieParser from 'cookie-parser';
  import path from 'path';
  import { fileURLToPath } from 'url';
  import bodyParser from 'body-parser';

  // Routes
  import authRoutes from './routes/auth.js';
  import userRoutes from './routes/users.js';
  import workoutRoutes from './routes/workouts.js';
  import goalRoutes from './routes/goals.js';
  import dashboardRoutes from './routes/dashboard.js';

  // Config
  dotenv.config();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const app = express();
  const PORT = process.env.PORT || 5000;
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness-tracker';

  // Middleware
  // app.use(express.json());
  app.use(bodyParser.urlencoded())

  // parse application/json
  app.use(bodyParser.json())
  app.use(cookieParser());
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }));

  // Static files (for production)
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
  }

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/workouts', workoutRoutes);
  app.use('/api/goals', goalRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // Catch-all route for SPA (production)
  if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
  }

  // Database connection with retry logic
  const connectWithRetry = () => {
    mongoose.connect(MONGO_URI)
      .then(() => {
        console.log('Connected to MongoDB');
        
        // Start server only after successful database connection
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
      })
      .catch(err => {
        console.error('MongoDB connection error:', err);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
      });
  };

  // Initial connection attempt
  connectWithRetry();

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
  });
