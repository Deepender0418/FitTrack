import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Filter, 
  Calendar, 
  Clock,
  Dumbbell,
  Trash2,
  Edit
} from 'lucide-react';
import WorkoutForm from '../components/forms/WorkoutForm';
import api from '../utils/api';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

interface Workout {
  _id: string;
  title: string;
  date: string;
  duration: number;
  exercises: Exercise[];
  notes?: string;
  type: string;
  completed: boolean;
}

const Workouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await api.get('/workouts');
        setWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const filteredWorkouts = workouts.filter(workout => {
    if (filter === 'all') return true;
    if (filter === 'completed') return workout.completed;
    if (filter === 'planned') return !workout.completed;
    return true;
  });

  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleAddWorkout = () => {
    setSelectedWorkout(null);
    setIsFormOpen(true);
  };

  const handleEditWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsFormOpen(true);
  };

  const handleSaveWorkout = async (workout: any) => {
    try {
      if (workout._id) {
        const response = await api.put(`/workouts/${workout._id}`, workout);
        setWorkouts(workouts.map(w => w._id === workout._id ? response.data : w));
      } else {
        const response = await api.post('/workouts', workout);
        setWorkouts([...workouts, response.data]);
      }
    } catch (error) {
      console.error('Error saving workout:', error);
    } finally {
      setIsFormOpen(false);
    }
  };

  const handleToggleComplete = async (workoutId: string) => {
    try {
      const response = await api.put(`/workouts/${workoutId}/toggle-complete`);
      const updatedWorkouts = workouts.map(workout => {
        if (workout._id === workoutId) {
          return response.data;
        }
        return workout;
      });
      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error toggling workout completion:', error);
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      await api.delete(`/workouts/${workoutId}`);
      setWorkouts(workouts.filter(workout => workout._id !== workoutId));
    } catch (error) {
      console.error('Error deleting workout:', error);
    } finally {
      setConfirmDelete(null);
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Workouts</h1>
          <p className="text-gray-600 mt-1">Schedule and track your workout sessions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative inline-block">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input py-2 pr-10 pl-4 appearance-none"
            >
              <option value="all">All Workouts</option>
              <option value="completed">Completed</option>
              <option value="planned">Planned</option>
            </select>
            <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          
          <button 
            onClick={handleAddWorkout}
            className="btn-primary flex items-center justify-center"
          >
            <Plus size={16} className="mr-1" />
            Add Workout
          </button>
        </div>
      </div>

      {/* Workouts list */}
      {sortedWorkouts.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="flex justify-center mb-4">
            <Dumbbell size={48} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? "You haven't created any workouts yet. Start by adding a new workout." 
              : filter === 'planned' 
                ? "You don't have any planned workouts. Add a new workout to get started."
                : "You haven't completed any workouts yet. Mark your workouts as complete as you finish them!"}
          </p>
          <button 
            onClick={handleAddWorkout}
            className="btn-primary"
          >
            <Plus size={16} className="mr-1" />
            Create your first workout
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedWorkouts.map((workout, index) => (
            <motion.div
              key={workout._id}
              className={`card ${
                workout.completed ? 'border-l-4 border-green-500' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span 
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        workout.type === 'Strength' ? 'bg-blue-50 text-blue-600' :
                        workout.type === 'Cardio' ? 'bg-emerald-50 text-emerald-600' :
                        workout.type === 'Flexibility' ? 'bg-orange-50 text-orange-600' :
                        'bg-purple-50 text-purple-600'
                      }`}
                    >
                      {workout.type}
                    </span>
                    
                    {workout.completed && (
                      <span className="px-2 py-1 rounded-md bg-green-50 text-green-600 text-xs font-medium">
                        Completed
                      </span>
                    )}

                    <span className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      {new Date(workout.date).toLocaleDateString()}
                    </span>

                    <span className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      {workout.duration} min
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{workout.title}</h3>
                  
                  {/* Exercises */}
                  <div className="space-y-1 text-sm text-gray-600 mb-2">
                    {workout.exercises.slice(0, 3).map((exercise, i) => (
                      <p key={i}>
                        {exercise.name}: {exercise.sets} × {exercise.reps} 
                        {exercise.weight ? ` @ ${exercise.weight} lbs` : ''}
                        {exercise.duration ? ` (${exercise.duration} min)` : ''}
                      </p>
                    ))}
                    {workout.exercises.length > 3 && (
                      <p className="text-blue-600">+{workout.exercises.length - 3} more exercises</p>
                    )}
                  </div>
                  
                  {workout.notes && (
                    <p className="text-sm text-gray-500 italic">{workout.notes}</p>
                  )}
                </div>
                
                <div className="flex mt-4 md:mt-0 space-x-2">
                  <button
                    className={`p-2 rounded-md text-sm ${
                      workout.completed 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    onClick={() => handleToggleComplete(workout._id)}
                  >
                    {workout.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  
                  <button
                    className="p-2 rounded-md text-blue-600 hover:bg-blue-50"
                    onClick={() => handleEditWorkout(workout)}
                  >
                    <Edit size={18} />
                  </button>
                  
                  <button
                    className="p-2 rounded-md text-red-600 hover:bg-red-50"
                    onClick={() => setConfirmDelete(workout._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Workout Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WorkoutForm 
                workout={selectedWorkout} 
                onSave={handleSaveWorkout} 
                onCancel={() => setIsFormOpen(false)} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-bold mb-3">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this workout? This action cannot be undone.</p>
              
              <div className="flex justify-end space-x-3">
                <button
                  className="btn-outline"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                  onClick={() => handleDeleteWorkout(confirmDelete)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Workouts;