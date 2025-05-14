import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Workout {
  _id: string;
  type: string;
  duration: number;
  date: string;
}

interface DashboardChartProps {
  workouts: Workout[];
}

const DashboardChart = ({ workouts }: DashboardChartProps) => {
  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  // Format dates for labels
  const labels = last7Days.map(date => 
    date.toLocaleDateString('en-US', { weekday: 'short' })
  );

  // Group workouts by type and day
  const workoutsByType = {
    Strength: new Array(7).fill(0),
    Cardio: new Array(7).fill(0),
    Flexibility: new Array(7).fill(0),
  };

  workouts.forEach(workout => {
    const workoutDate = new Date(workout.date);
    const dayIndex = last7Days.findIndex(date => 
      date.toDateString() === workoutDate.toDateString()
    );
    
    if (dayIndex !== -1 && workout.type in workoutsByType) {
      workoutsByType[workout.type][dayIndex] = workout.duration;
    }
  });

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        bodyFont: {
          size: 12,
        },
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw} mins`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
          callback: function(value: number) {
            return `${value} min`;
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  // Data for the chart
  const data = {
    labels,
    datasets: [
      {
        label: 'Strength',
        data: workoutsByType.Strength,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
      },
      {
        label: 'Cardio',
        data: workoutsByType.Cardio,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 4,
      },
      {
        label: 'Flexibility',
        data: workoutsByType.Flexibility,
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="h-64">
      <Bar options={options} data={data} />
    </div>
  );
};

export default DashboardChart;