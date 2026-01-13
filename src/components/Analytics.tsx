import React from 'react';
import { PassengerData } from '../types';
import { TrendingUp, Clock, Users, AlertTriangle } from 'lucide-react';

interface AnalyticsProps {
  passengerHistory: PassengerData[];
  currentCount: number;
  busCapacity: number;
}

const Analytics: React.FC<AnalyticsProps> = ({ passengerHistory, currentCount, busCapacity }) => {
  const getAverageLoad = (): number => {
    if (passengerHistory.length === 0) return 0;
    const total = passengerHistory.reduce((sum, data) => sum + data.count, 0);
    return total / passengerHistory.length;
  };

  const getPeakLoad = (): number => {
    if (passengerHistory.length === 0) return currentCount;
    return Math.max(...passengerHistory.map(data => data.count), currentCount);
  };

  const getMinLoad = (): number => {
    if (passengerHistory.length === 0) return currentCount;
    return Math.min(...passengerHistory.map(data => data.count), currentCount);
  };

  const getPredictedLoad = (): number => {
    if (passengerHistory.length < 5) return currentCount;
    
    // Simple trend analysis
    const recent = passengerHistory.slice(-5);
    const trend = recent.reduce((sum, data, index) => {
      if (index === 0) return 0;
      return sum + (data.count - recent[index - 1].count);
    }, 0) / (recent.length - 1);
    
    return Math.max(0, Math.min(busCapacity, currentCount + trend * 3));
  };

  const getTimeBasedPrediction = (): string => {
    const hour = new Date().getHours();
    const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
    const percentage = (currentCount / busCapacity) * 100;
    
    if (isRushHour) {
      if (percentage < 50) return 'Likely to increase during rush hour';
      if (percentage < 75) return 'May reach capacity soon';
      return 'Critical - likely to exceed capacity';
    } else {
      if (percentage > 75) return 'Expected to decrease in off-peak hours';
      return 'Stable passenger flow expected';
    }
  };

  const recentData = passengerHistory.slice(-20);
  const maxCount = Math.max(...recentData.map(d => d.count), busCapacity);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Peak Load</span>
          </div>
          <div className="text-2xl font-bold text-blue-800">{getPeakLoad()}</div>
          <div className="text-sm text-blue-600">passengers</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Avg Load</span>
          </div>
          <div className="text-2xl font-bold text-green-800">{getAverageLoad().toFixed(1)}</div>
          <div className="text-sm text-green-600">passengers</div>
        </div>
      </div>

      {/* Simple Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-4">Passenger Flow (Last 20 readings)</h4>
        <div className="relative h-32">
          <div className="absolute inset-0 flex items-end space-x-1">
            {recentData.map((data, index) => (
              <div
                key={index}
                className="bg-blue-500 rounded-t flex-1 transition-all duration-300"
                style={{ height: `${(data.count / maxCount) * 100}%` }}
                title={`${data.count} passengers at ${data.timestamp.toLocaleTimeString()}`}
              ></div>
            ))}
          </div>
          
          {/* Capacity Line */}
          <div
            className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed"
            style={{ bottom: `${(busCapacity / maxCount) * 100}%` }}
          >
            <span className="text-xs text-red-600 bg-white px-1 rounded">Capacity</span>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>20 readings ago</span>
          <span>Now</span>
        </div>
      </div>

      {/* Predictions */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <span className="font-semibold text-yellow-800">Predictive Analytics</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-yellow-700">Predicted Load (15 min):</span>
            <span className="font-semibold text-yellow-800">{getPredictedLoad().toFixed(0)} passengers</span>
          </div>
          <div className="text-sm text-yellow-700">{getTimeBasedPrediction()}</div>
        </div>
      </div>

      {/* Flow Statistics */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-600">Min Load Today</div>
          <div className="font-semibold text-gray-800">{getMinLoad()} passengers</div>
        </div>
        <div>
          <div className="text-gray-600">Capacity Usage</div>
          <div className="font-semibold text-gray-800">{((currentCount / busCapacity) * 100).toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;