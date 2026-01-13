import React from 'react';
import { LogIn, LogOut, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { SensorEvent } from '../types';

interface SensorControlsProps {
  onSensorEvent: (type: SensorEvent) => void;
  isAutoMode: boolean;
  onToggleAutoMode: (enabled: boolean) => void;
  onReset: () => void;
  currentCount: number;
  busCapacity: number;
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const SensorControls: React.FC<SensorControlsProps> = ({
  onSensorEvent,
  isAutoMode,
  onToggleAutoMode,
  onReset,
  currentCount,
  busCapacity,
  simulationSpeed,
  onSpeedChange
}) => {
  const getSpeedLabel = (speed: number): string => {
    if (speed <= 1000) return 'Very Fast';
    if (speed <= 2000) return 'Fast';
    if (speed <= 3000) return 'Normal';
    if (speed <= 4000) return 'Slow';
    return 'Very Slow';
  };

  return (
    <div className="space-y-6">
      {/* Manual Controls */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-4 flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Manual Sensor Testing</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onSensorEvent('entry')}
            disabled={currentCount >= busCapacity}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <LogIn className="h-5 w-5" />
            <span>Simulate Entry</span>
          </button>
          
          <button
            onClick={() => onSensorEvent('exit')}
            disabled={currentCount <= 0}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Simulate Exit</span>
          </button>
        </div>
      </div>

      {/* Auto Mode */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-700 mb-4">Enhanced Automatic Simulation</h4>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-medium text-blue-800">Auto Mode</div>
            <div className="text-sm text-blue-600">
              {isAutoMode ? `Simulating realistic passenger flow (${getSpeedLabel(simulationSpeed)})` : 'Manual control enabled'}
            </div>
          </div>
          
          <button
            onClick={() => onToggleAutoMode(!isAutoMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isAutoMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
            }`}
          >
            {isAutoMode ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isAutoMode ? 'Pause' : 'Start'}</span>
          </button>
        </div>
        
        {/* Simulation Speed Control */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-blue-700 mb-2">
            Simulation Speed: {getSpeedLabel(simulationSpeed)}
          </label>
          <input
            type="range"
            min="500"
            max="5000"
            step="500"
            value={simulationSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            disabled={!isAutoMode}
          />
          <div className="flex justify-between text-xs text-blue-600 mt-1">
            <span>Very Fast</span>
            <span>Normal</span>
            <span>Very Slow</span>
          </div>
        </div>
        
        {isAutoMode && (
          <div className="text-sm text-blue-600 bg-white rounded p-3">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Enhanced auto-simulation active</span>
            </div>
            <div className="ml-4 text-blue-500 space-y-1">
              <div>• Rush hour patterns: 7-9 AM, 5-7 PM (higher boarding)</div>
              <div>• Lunch time: 12-2 PM (moderate activity)</div>
              <div>• Evening commute: 5-7 PM (higher alighting)</div>
              <div>• Dynamic occupancy-based behavior</div>
            </div>
          </div>
        )}
      </div>

      {/* System Controls */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-4">System Controls</h4>
        
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset System</span>
        </button>
        
        <div className="text-sm text-gray-600 mt-2">
          This will reset passenger count, clear all data history, reset seat map, and stop auto-simulation
        </div>
      </div>

      {/* Sensor Status */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-4">Sensor Status</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <LogIn className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm font-medium text-gray-700">Entry Sensor</div>
            <div className="text-xs text-green-600">Active</div>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <LogOut className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm font-medium text-gray-700">Exit Sensor</div>
            <div className="text-xs text-red-600">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorControls;