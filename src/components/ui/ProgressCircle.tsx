import { motion } from 'framer-motion';

interface ProgressCircleProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  color?: string;
}

const ProgressCircle = ({ 
  percentage, 
  size = 80, 
  strokeWidth = 6,
  color = '#3B82F6'
}: ProgressCircleProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Percentage text */}
      <div 
        className="absolute inset-0 flex items-center justify-center text-sm font-medium"
        style={{ color }}
      >
        {percentage}%
      </div>
    </div>
  );
};

export default ProgressCircle;