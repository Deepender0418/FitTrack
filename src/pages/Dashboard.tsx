import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  Flame, 
  LineChart, 
  Trophy,
  ChevronRight,
  ArrowUpRight,
  Dumbbell,
  Target,
} from 'lucide-react';
import DashboardChart from '../components/charts/DashboardChart';
import ProgressCircle from '../components/ui/ProgressCircle';
import ActivityCard from '../components/cards/ActivityCard';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface DashboardData {
  recentActivities: any[];
  stats: {
    workoutsThisWeek: number;
    completedGoals: number;
    streakDays: number;
    caloriesBurned: number;
  };
  goals: any[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    recentActivities: [],
    stats: {
      workoutsThisWeek: 0,
      completedGoals: 0,
      streakDays: 0,
      caloriesBurned: 0
    },
    goals: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Refresh data every minute
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleActivityClick = (activityId: string) => {
    navigate(`/workouts?id=${activityId}`);
  };

  const handleGoalClick = (goalId: string) => {
    navigate(`/goals?id=${goalId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <motion.div
          className="w-12 h-12 border-4 border-blue-200 rounded-full"
          style={{ borderTopColor: '#3B82F6' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your fitness journey</p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: 'Workouts this week', 
            value: data.stats.workoutsThisWeek, 
            icon: <Dumbbell size={20} />, 
            color: 'blue',
            link: '/workouts'
          },
          { 
            title: 'Completed goals', 
            value: data.stats.completedGoals, 
            icon: <Target size={20} />, 
            color: 'green',
            link: '/goals'
          },
          { 
            title: 'Day streak', 
            value: data.stats.streakDays, 
            icon: <CalendarDays size={20} />, 
            color: 'orange',
            link: '/profile'
          },
          { 
            title: 'Calories burned', 
            value: data.stats.caloriesBurned, 
            icon: <Flame size={20} />, 
            color: 'red',
            link: '/workouts'
          }
        ].map((stat, index) => (
          <Link to={stat.link} key={index}>
            <motion.div
              className="card cursor-pointer hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`bg-${stat.color}-100 p-2 rounded-lg text-${stat.color}-500`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Middle section: Chart and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity chart */}
        <motion.div
          className="card col-span-1 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Activity Overview</h2>
            <Link 
              to="/workouts" 
              className="flex items-center text-blue-600 text-sm hover:text-blue-800"
            >
              <span>View detailed stats</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          <DashboardChart workouts={data.recentActivities} />
        </motion.div>

        {/* Goals progress */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Active Goals</h2>
            <Link 
              to="/goals" 
              className="flex items-center text-blue-600 text-sm hover:text-blue-800"
            >
              <span>View all</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {data.goals.length === 0 ? (
              <div className="text-center py-6">
                <Target size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No active goals</p>
                <Link to="/goals" className="btn-primary mt-4 inline-flex items-center">
                  <Target size={16} className="mr-2" />
                  Set a new goal
                </Link>
              </div>
            ) : (
              data.goals.map((goal) => (
                <div 
                  key={goal._id} 
                  className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  onClick={() => handleGoalClick(goal._id)}
                >
                  <ProgressCircle percentage={goal.progress} size={60} strokeWidth={5} />
                  <div className="ml-3">
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-sm text-gray-500">{goal.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent activities */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
          <Link 
            to="/workouts" 
            className="flex items-center text-blue-600 text-sm hover:text-blue-800"
          >
            <span>View all</span>
            <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.recentActivities.length === 0 ? (
            <div className="col-span-3 text-center py-6">
              <Dumbbell size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">No recent activities</p>
              <Link to="/workouts" className="btn-primary mt-4 inline-flex items-center">
                <Dumbbell size={16} className="mr-2" />
                Log a workout
              </Link>
            </div>
          ) : (
            data.recentActivities.map((activity) => (
              <div 
                key={activity._id}
                onClick={() => handleActivityClick(activity._id)}
                className="cursor-pointer"
              >
                <ActivityCard activity={activity} />
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;