import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';

interface Goal {
  _id?: string;
  title: string;
  description: string;
  targetDate: string;
  category: string;
  progress?: number;
  completed?: boolean;
}

interface GoalFormProps {
  goal: Goal | null;
  onSave: (goal: Goal) => void;
  onCancel: () => void;
}

const GoalForm = ({ goal, onSave, onCancel }: GoalFormProps) => {
  const [formData, setFormData] = useState<Goal>({
    _id: goal?._id || undefined,
    title: goal?.title || '',
    description: goal?.description || '',
    targetDate: goal?.targetDate || new Date().toISOString().split('T')[0],
    category: goal?.category || 'Strength',
    progress: goal?.progress || 0,
    completed: goal?.completed || false
  });

  const categories = ['Strength', 'Cardio', 'Flexibility', 'Consistency', 'Nutrition', 'Recovery'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {goal ? 'Edit Goal' : 'Create New Goal'}
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
          <label htmlFor="title" className="label">Goal Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Run a 5K"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input min-h-[100px]"
            placeholder="Describe your goal and how you'll measure success"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="category" className="label">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="targetDate" className="label">Target Date</label>
            <input
              type="date"
              id="targetDate"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>

        {goal && (
          <div className="form-group">
            <label htmlFor="progress" className="label">Progress ({formData.progress}%)</label>
            <input
              type="range"
              id="progress"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

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
            {goal ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;