import React from 'react';
import { CrowdLevel } from '../types';

interface EnhancedBusLayoutProps {
  seatOccupancy: number[];
  crowdLevel: CrowdLevel;
  busName: string;
  availableSeats: number;
  totalSeats: number;
}

const EnhancedBusLayout: React.FC<EnhancedBusLayoutProps> = ({ 
  seatOccupancy, 
  crowdLevel, 
  busName, 
  availableSeats, 
  totalSeats 
}) => {
  const getSeatEmoji = (occupancy: number): string => {
    return occupancy === 0 ? '🟩' : '🟥';
  };

  const getHeatmapColor = (level: CrowdLevel): string => {
    switch (level) {
      case 'Low': return 'bg-green-100 border-green-300';
      case 'Moderate': return 'bg-yellow-100 border-yellow-300';
      case 'High': return 'bg-orange-100 border-orange-300';
      case 'Overcrowded': return 'bg-red-100 border-red-300';
    }
  };

  const getCrowdLevelColor = (level: CrowdLevel): string => {
    switch (level) {
      case 'Low': return 'bg-green-200 text-green-800';
      case 'Moderate': return 'bg-yellow-200 text-yellow-800';
      case 'High': return 'bg-orange-200 text-orange-800';
      case 'Overcrowded': return 'bg-red-200 text-red-800';
    }
  };

  // Organize seats in a more realistic bus layout (4 rows of 10 seats each)
  const seatRows = [];
  for (let i = 0; i < 4; i++) {
    seatRows.push(seatOccupancy.slice(i * 10, (i + 1) * 10));
  }

  return (
    <div className="space-y-6">
      {/* Bus Status Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{busName}</h3>
        <div className="flex justify-center items-center space-x-6">
          <div className="bg-green-100 px-6 py-3 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-green-800">{availableSeats}</div>
            <div className="text-sm text-green-600 font-medium">Available Seats</div>
          </div>
          <div className="bg-red-100 px-6 py-3 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-red-800">{totalSeats - availableSeats}</div>
            <div className="text-sm text-red-600 font-medium">Occupied Seats</div>
          </div>
          <div className={`px-6 py-3 rounded-xl shadow-sm ${getCrowdLevelColor(crowdLevel)}`}>
            <div className="text-lg font-bold">{crowdLevel}</div>
            <div className="text-sm font-medium">Crowd Level</div>
          </div>
        </div>
      </div>

      {/* Enhanced Bus Layout */}
      <div className={`p-8 rounded-2xl border-2 ${getHeatmapColor(crowdLevel)} shadow-lg`}>
        <div className="bg-white rounded-xl p-6 shadow-inner">
          {/* Driver Section */}
          <div className="flex justify-center items-center mb-8">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md">
              🚌 Driver
            </div>
          </div>
          
          {/* Entry/Exit Door */}
          <div className="flex justify-center mb-8">
            <div className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold shadow-md">
              🚪 Entry/Exit Door
            </div>
          </div>
          
          {/* Seat Layout - 4 rows of 10 seats */}
          <div className="space-y-4">
            {seatRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center">
                <div className="grid grid-cols-10 gap-2">
                  {row.map((occupancy, seatIndex) => {
                    const globalSeatIndex = rowIndex * 10 + seatIndex;
                    return (
                      <div
                        key={globalSeatIndex}
                        className="relative group cursor-pointer transform transition-all duration-200 hover:scale-110"
                        title={`Seat ${globalSeatIndex + 1}: ${occupancy > 0 ? 'Occupied' : 'Available'}`}
                      >
                        <div className="text-3xl select-none">
                          {getSeatEmoji(occupancy)}
                        </div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {globalSeatIndex + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Aisle Indicator */}
          <div className="text-center mt-6 text-gray-500 text-sm font-medium">
            ← Aisle →
          </div>
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
        <h4 className="font-bold text-gray-800 mb-4 text-center">Seat Status Legend</h4>
        <div className="flex justify-center space-x-12">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🟩</span>
            <div>
              <div className="font-bold text-green-700">Available</div>
              <div className="text-sm text-green-600">{availableSeats} seats</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🟥</span>
            <div>
              <div className="font-bold text-red-700">Occupied</div>
              <div className="text-sm text-red-600">{totalSeats - availableSeats} seats</div>
            </div>
          </div>
        </div>
        
        {/* Occupancy Percentage Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
            <span>Occupancy Rate</span>
            <span>{((totalSeats - availableSeats) / totalSeats * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                crowdLevel === 'Low' ? 'bg-green-500' :
                crowdLevel === 'Moderate' ? 'bg-yellow-500' :
                crowdLevel === 'High' ? 'bg-orange-500' :
                'bg-red-500'
              }`}
              style={{ width: `${(totalSeats - availableSeats) / totalSeats * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBusLayout;