import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Target,
  Calendar
} from 'lucide-react';
import GoalForm from '../components/forms/GoalForm';
import api from '../utils/api';

interface Goal {
  _id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  category: string;
  completed: boolean;
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await api.get('/goals');
        setGoals(response.data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    if (filter === 'active') return !goal.completed;
    if (filter === 'completed') return goal.completed;
    return true;
  });

  const handleAddGoal = () => {
    setSelectedGoal(null);
    setIsFormOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsFormOpen(true);
  };

  const handleSaveGoal = async (goal: any) => {
    try {
      if (goal._id) {
        const response = await api.put(`/goals/${goal._id}`, goal);
        setGoals(goals.map(g => g._id === goal._id ? response.data : g));
      } else {
        const response = await api.post('/goals', goal);
        setGoals([...goals, response.data]);
      }
    } catch (error) {
      console.error('Error saving goal:', error);
    } finally {
      setIsFormOpen(false);
    }
  };

  const handleToggleComplete = async (goalId: string) => {
    try {
      const response = await api.put(`/goals/${goalId}/toggle-complete`);
      const updatedGoals = goals.map(goal => {
        if (goal._id === goalId) {
          return response.data;
        }
        return goal;
      });
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error toggling goal completion:', error);
    }
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
    <div className="space-y-6">
      {/* Header with filter and add button */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Fitness Goals</h1>
          <p className="text-gray-600 mt-1">Track and manage your fitness goals</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative inline-block">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input py-2 pr-10 pl-4 appearance-none"
            >
              <option value="all">All Goals</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          
          <button 
            onClick={handleAddGoal}
            className="btn-primary flex items-center justify-center"
          >
            <Plus size={16} className="mr-1" />
            Add Goal
          </button>
        </div>
      </div>

      {/* Goals grid/list */}
      {filteredGoals.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="flex justify-center mb-4">
            <Target size={48} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? "You haven't created any goals yet. Start by adding a new goal." 
              : filter === 'active' 
                ? "You don't have any active goals. Add a new goal or check your completed goals."
                : "You haven't completed any goals yet. Keep working toward your active goals!"}
          </p>
          <button 
            onClick={handleAddGoal}
            className="btn-primary"
          >
            <Plus size={16} className="mr-1" />
            Create your first goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal, index) => (
            <motion.div
              key={goal._id}
              className={`card cursor-pointer transition-all duration-200 border-l-4 ${
                goal.completed ? 'border-green-500' : 'border-blue-500'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handleEditGoal(goal)}
              whileHover={{ y: -4 }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span 
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        goal.category === 'Strength' ? 'bg-blue-50 text-blue-600' :
                        goal.category === 'Cardio' ? 'bg-emerald-50 text-emerald-600' :
                        goal.category === 'Flexibility' ? 'bg-orange-50 text-orange-600' :
                        'bg-purple-50 text-purple-600'
                      }`}
                    >
                      {goal.category}
                    </span>
                    
                    {goal.completed && (
                      <span className="ml-2 px-2 py-1 rounded-md bg-green-50 text-green-600 text-xs font-medium flex items-center">
                        <CheckCircle2 size={12} className="mr-1" />
                        Completed
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{goal.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar size={16} className="mr-1" />
                    <span>Due by {new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <motion.div 
                        className={`h-2.5 rounded-full ${goal.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: '0%' }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  className={`p-2 rounded-md text-sm font-medium ${
                    goal.completed 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleComplete(goal._id);
                  }}
                >
                  {goal.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Goal Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <GoalForm 
                goal={selectedGoal} 
                onSave={handleSaveGoal} 
                onCancel={() => setIsFormOpen(false)} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;