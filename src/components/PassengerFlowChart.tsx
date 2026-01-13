import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PassengerData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PassengerFlowChartProps {
  passengerHistory: PassengerData[];
  busCapacity: number;
}

const PassengerFlowChart: React.FC<PassengerFlowChartProps> = ({ 
  passengerHistory, 
  busCapacity 
}) => {
  const chartData = {
    labels: passengerHistory.map(data => 
      data.timestamp.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    ),
    datasets: [
      {
        label: 'Passenger Count',
        data: passengerHistory.map(data => data.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
      },
      {
        label: 'Bus Capacity',
        data: passengerHistory.map(() => busCapacity),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Real-Time Passenger Flow',
        font: {
          size: 16,
          weight: 'bold' as const,
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            if (context.datasetIndex === 0) {
              const percentage = ((context.parsed.y / busCapacity) * 100).toFixed(1);
              return `Passengers: ${context.parsed.y} (${percentage}%)`;
            }
            return `Capacity: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
          font: {
            weight: 'bold' as const,
          }
        },
        ticks: {
          maxTicksLimit: 10,
          maxRotation: 45,
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Number of Passengers',
          font: {
            weight: 'bold' as const,
          }
        },
        beginAtZero: true,
        max: Math.max(busCapacity + 5, Math.max(...passengerHistory.map(d => d.count)) + 5),
        ticks: {
          stepSize: 5,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const,
    },
  };

  if (passengerHistory.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-gray-400 mb-2">📊</div>
          <p className="text-gray-500">No data available yet</p>
          <p className="text-sm text-gray-400">Start simulation to see passenger flow</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PassengerFlowChart;