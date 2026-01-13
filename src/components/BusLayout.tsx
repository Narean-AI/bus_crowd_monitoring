import React from 'react';
import { CrowdLevel } from '../types';

interface BusLayoutProps {
  seatOccupancy: number[];
  crowdLevel: CrowdLevel;
  busName: string;
  availableSeats: number;
  totalSeats: number;
}

const BusLayout: React.FC<BusLayoutProps> = ({ 
  seatOccupancy, 
  crowdLevel, 
  busName, 
  availableSeats, 
  totalSeats 
}) => {
  const getSeatColor = (occupancy: number): string => {
    if (occupancy === 0) return 'bg-green-400'; // Available - Green
    return 'bg-red-400'; // Occupied - Red
  };

  const getHeatmapColor = (level: CrowdLevel): string => {
    switch (level) {
      case 'Low': return 'bg-green-100 border-green-300';
      case 'Moderate': return 'bg-yellow-100 border-yellow-300';
      case 'High': return 'bg-orange-100 border-orange-300';
      case 'Overcrowded': return 'bg-red-100 border-red-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Bus Name and Availability */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{busName}</h3>
        <div className="flex justify-center items-center space-x-4">
          <div className="bg-green-100 px-4 py-2 rounded-lg">
            <span className="text-green-800 font-semibold">Available Seats: {availableSeats}</span>
          </div>
          <div className="bg-blue-100 px-4 py-2 rounded-lg">
            <span className="text-blue-800 font-semibold">Total Seats: {totalSeats}</span>
          </div>
        </div>
      </div>

      {/* Bus Overview */}
      <div className={`p-6 rounded-lg border-2 ${getHeatmapColor(crowdLevel)}`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-700">Bus Layout</h4>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            crowdLevel === 'Low' ? 'bg-green-200 text-green-800' :
            crowdLevel === 'Moderate' ? 'bg-yellow-200 text-yellow-800' :
            crowdLevel === 'High' ? 'bg-orange-200 text-orange-800' :
            'bg-red-200 text-red-800'
          }`}>
            {crowdLevel}
          </span>
        </div>
        
        {/* Bus Shape */}
        <div className="relative bg-white rounded-lg p-6 shadow-inner">
          {/* Driver Area */}
          <div className="flex justify-center items-center mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">Driver</span>
            </div>
          </div>
          
          {/* Single Door (Entry/Exit) */}
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 px-4 py-2 rounded-lg text-white font-medium">
              Entry/Exit Door
            </div>
          </div>
          
          {/* Seats Layout - Single Section */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {seatOccupancy.map((occupancy, index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-lg ${getSeatColor(occupancy)} border-2 border-gray-300 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer`}
                title={`Seat ${index + 1}: ${occupancy > 0 ? 'Occupied' : 'Available'}`}
              >
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
            ))}
          </div>
          
          {/* Seat Availability Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-100 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-800">{availableSeats}</div>
                <div className="text-sm text-green-600">Available</div>
              </div>
              <div className="bg-red-100 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-800">{totalSeats - availableSeats}</div>
                <div className="text-sm text-red-600">Occupied</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-3">Seat Status</h4>
        <div className="flex justify-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-400 rounded border-2 border-gray-300"></div>
            <span className="font-medium text-green-700">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-400 rounded border-2 border-gray-300"></div>
            <span className="font-medium text-red-700">Occupied</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusLayout;