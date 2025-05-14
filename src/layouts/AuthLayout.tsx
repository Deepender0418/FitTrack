import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <motion.div 
          className="text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <Dumbbell size={64} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">FitTrack</h1>
          <p className="text-xl md:text-2xl mb-6">Track your progress. Achieve your goals.</p>
          <div className="space-y-4 md:space-y-6 mt-8 max-w-md mx-auto">
            <motion.div 
              className="bg-white/10 p-4 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-semibold text-lg mb-2">Track Workouts</h3>
              <p className="text-blue-100">Log your exercises, sets, reps, and weights easily.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 p-4 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-semibold text-lg mb-2">Set Goals</h3>
              <p className="text-blue-100">Define your fitness goals and track your progress.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 p-4 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="font-semibold text-lg mb-2">See Results</h3>
              <p className="text-blue-100">Visualize your progress with detailed charts and metrics.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Right side - Auth forms */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;