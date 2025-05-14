import { motion } from 'framer-motion';
import { Dumbbell, PersonStanding as PersonRunning, StretchVertical as Stretch, Clock } from 'lucide-react';

interface Activity {
  _id: string;
  type: string;
  title: string;
  duration: number;
  date: string;
  completed: boolean;
}

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  const { type, title, duration, date, completed } = activity;
  
  const getIcon = () => {
    switch (type) {
      case 'Strength':
        return <Dumbbell size={20} />;
      case 'Cardio':
        return <PersonRunning size={20} />;
      case 'Flexibility':
        return <Stretch size={20} />;
      default:
        return <Dumbbell size={20} />;
    }
  };
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'Strength':
        return 'bg-blue-50 text-blue-600';
      case 'Cardio':
        return 'bg-emerald-50 text-emerald-600';
      case 'Flexibility':
        return 'bg-orange-50 text-orange-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <motion.div 
      className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getBackgroundColor()}`}>
            {type}
          </span>
          <span className="text-xs text-gray-500">{formatDate(date)}</span>
        </div>
        
        <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <Clock size={16} className="mr-1" />
            <span>{duration} min</span>
          </div>
          
          {completed && (
            <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
              Completed
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;