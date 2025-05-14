import { useState, FormEvent } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

interface Workout {
  _id?: string;
  title: string;
  date: string;
  duration: number;
  exercises: Exercise[];
  notes?: string;
  type: string;
  completed?: boolean;
}

interface WorkoutFormProps {
  workout: Workout | null;
  onSave: (workout: Workout) => void;
  onCancel: () => void;
}

const WorkoutForm = ({ workout, onSave, onCancel }: WorkoutFormProps) => {
  const [formData, setFormData] = useState<Workout>({
    _id: workout?._id || undefined,
    title: workout?.title || '',
    date: workout?.date || new Date().toISOString().split('T')[0],
    duration: workout?.duration || 60,
    type: workout?.type || 'Strength',
    exercises: workout?.exercises || [{ name: '', sets: 3, reps: 10 }],
    notes: workout?.notes || '',
    completed: workout?.completed || false
  });

  const workoutTypes = ['Strength', 'Cardio', 'Flexibility', 'HIIT', 'Recovery'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'duration' ? parseInt(value) : value
    });
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    const updatedExercises = [...formData.exercises];
    
    if (field === 'sets' || field === 'reps' || field === 'weight' || field === 'duration') {
      updatedExercises[index][field] = value === '' ? undefined : Number(value);
    } else {
      updatedExercises[index][field as 'name' | 'notes'] = value as string;
    }
    
    setFormData({
      ...formData,
      exercises: updatedExercises
    });
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: 3, reps: 10 }]
    });
  };

  const removeExercise = (index: number) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises.splice(index, 1);
    setFormData({
      ...formData,
      exercises: updatedExercises
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate that all exercises have names
    const validExercises = formData.exercises.filter(ex => ex.name.trim() !== '');
    
    if (validExercises.length === 0) {
      alert('Please add at least one exercise with a name');
      return;
    }
    
    onSave({
      ...formData,
      exercises: validExercises
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {workout ? 'Edit Workout' : 'Create New Workout'}
        </h2>
        <button 
          className="p-1 rounded-full hover:bg-gray-100"
          onClick={onCancel}
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="title" className="label">Workout Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Upper Body Strength"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label htmlFor="type" className="label">Workout Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input"
              required
            >
              {workoutTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date" className="label">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration" className="label">Duration (mins)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="input"
              min="1"
              max="300"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="flex justify-between items-center mb-2">
            <label className="label mb-0">Exercises</label>
            <button
              type="button"
              onClick={addExercise}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add Exercise
            </button>
          </div>
          
          <div className="space-y-4 border rounded-md p-4 bg-gray-50">
            {formData.exercises.map((exercise, index) => (
              <div key={index} className="bg-white border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Exercise {index + 1}</h4>
                  {formData.exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="form-group mb-0">
                    <label className="label text-xs">Exercise Name</label>
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                      className="input py-1.5"
                      placeholder="e.g., Bench Press"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="form-group mb-0">
                      <label className="label text-xs">Sets</label>
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                        className="input py-1.5"
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="form-group mb-0">
                      <label className="label text-xs">Reps</label>
                      <input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        className="input py-1.5"
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="form-group mb-0">
                      <label className="label text-xs">Weight (lbs)</label>
                      <input
                        type="number"
                        value={exercise.weight || ''}
                        onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                        className="input py-1.5"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="label">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input"
            placeholder="Any additional notes about this workout"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {workout ? 'Update Workout' : 'Create Workout'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;