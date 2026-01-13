import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, TrendingUp, MapPin, Play, Pause, RotateCcw } from 'lucide-react';
import EnhancedBusLayout from './EnhancedBusLayout';
import BusSelector from './BusSelector';
import PassengerFlowChart from './PassengerFlowChart';
import SensorControls from './SensorControls';
import NotificationSystem from './NotificationSystem';
import { PassengerData, CrowdLevel, SensorEvent } from '../types';

const Dashboard: React.FC = () => {
  const [currentCount, setCurrentCount] = useState(0);
  const [busCapacity] = useState(40); // Reduced capacity for simpler layout
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [passengerHistory, setPassengerHistory] = useState<PassengerData[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [seatOccupancy, setSeatOccupancy] = useState<number[]>(Array(40).fill(0));
  const [userRole, setUserRole] = useState<'admin' | 'developer'>('admin');
  const [selectedBus, setSelectedBus] = useState('');
  const [savedBuses, setSavedBuses] = useState<string[]>(['Route 42', 'City Express', 'Downtown Shuttle']);
  const [simulationSpeed, setSimulationSpeed] = useState(2000); // milliseconds between events

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-simulation mode
  useEffect(() => {
    if (!isAutoMode || !selectedBus) return;

    const interval = setInterval(() => {
      // Enhanced realistic passenger patterns
      const hour = new Date().getHours();
      const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
      const isLunchTime = hour >= 12 && hour <= 14;
      const isEveningCommute = hour >= 17 && hour <= 19;
      
      // Dynamic probability based on time and current occupancy
      let entryChance = 0.4;
      let exitChance = 0.3;
      
      if (isRushHour) {
        entryChance = 0.7;
        exitChance = 0.2;
      } else if (isLunchTime) {
        entryChance = 0.5;
        exitChance = 0.4;
      } else if (isEveningCommute) {
        entryChance = 0.3;
        exitChance = 0.6;
      }
      
      // Adjust based on current occupancy
      const occupancyRate = currentCount / busCapacity;
      if (occupancyRate > 0.8) {
        entryChance *= 0.3; // Reduce entries when nearly full
        exitChance *= 1.5; // Increase exits when crowded
      } else if (occupancyRate < 0.2) {
        entryChance *= 1.3; // Increase entries when empty
        exitChance *= 0.5; // Reduce exits when few passengers
      }
      
      const totalChance = entryChance + exitChance;
      const randomValue = Math.random();
      
      if (randomValue < entryChance && currentCount < busCapacity) {
        handleSensorEvent(isEntry ? 'entry' : 'exit');
      } else if (randomValue < totalChance && currentCount > 0) {
        handleSensorEvent('exit');
      }
    }, simulationSpeed);

    return () => clearInterval(interval);
  }, [isAutoMode, currentCount, selectedBus, simulationSpeed]);

  // Store passenger data history
  useEffect(() => {
    if (!selectedBus) return;
    
    const interval = setInterval(() => {
      const newData: PassengerData = {
        timestamp: new Date(),
        count: currentCount,
        crowdLevel: getCrowdLevel(currentCount)
      };
      setPassengerHistory(prev => [...prev.slice(-100), newData]);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentCount, selectedBus]);

  const getCrowdLevel = (count: number): CrowdLevel => {
    const percentage = (count / busCapacity) * 100;
    if (percentage < 25) return 'Low';
    if (percentage < 50) return 'Moderate';
    if (percentage < 75) return 'High';
    return 'Overcrowded';
  };

  const getCrowdColor = (level: CrowdLevel): string => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Overcrowded': return 'text-red-600 bg-red-100';
    }
  };

  const handleSensorEvent = (type: SensorEvent) => {
    if (type === 'entry' && currentCount < busCapacity) {
      setCurrentCount(prev => prev + 1);
      updateSeatOccupancy('entry');
    } else if (type === 'exit' && currentCount > 0) {
      setCurrentCount(prev => prev - 1);
      updateSeatOccupancy('exit');
    }

    // Check for overcrowding alerts
    checkForAlerts();
  };

  const updateSeatOccupancy = (type: SensorEvent) => {
    setSeatOccupancy(prev => {
      const newOccupancy = [...prev];
      if (type === 'entry') {
        // Find empty seat and occupy it (prefer seats near the front)
        const emptyIndex = newOccupancy.findIndex(seat => seat === 0);
        if (emptyIndex !== -1) {
          newOccupancy[emptyIndex] = 1;
        }
      } else {
        // Find occupied seat and free it (prefer seats near the back for exits)
        const occupiedIndices = newOccupancy
          .map((seat, index) => seat > 0 ? index : -1)
          .filter(index => index !== -1);
        
        if (occupiedIndices.length > 0) {
          // Randomly select from occupied seats, with slight preference for back seats
          const occupiedIndex = occupiedIndices[Math.floor(Math.random() * occupiedIndices.length)];
          newOccupancy[occupiedIndex] = 0;
        }
      }
      return newOccupancy;
    });
  };

  // Enhanced seat occupation with more realistic patterns
  const simulateRealisticOccupancy = () => {
    setSeatOccupancy(prev => {
      const newOccupancy = [...prev];
      const occupiedCount = newOccupancy.filter(seat => seat > 0).length;
      
      // Simulate multiple passengers boarding/alighting
      const changes = Math.floor(Math.random() * 3) + 1; // 1-3 changes
      
      for (let i = 0; i < changes; i++) {
        if (Math.random() < 0.6 && occupiedCount < busCapacity * 0.9) {
          // Entry - find empty seat
          const emptyIndex = newOccupancy.findIndex(seat => seat === 0);
          if (emptyIndex !== -1) {
            newOccupancy[emptyIndex] = 1;
          }
        } else if (occupiedCount > 0) {
          // Exit - find occupied seat
          const occupiedIndex = newOccupancy.findIndex(seat => seat > 0);
        if (occupiedIndex !== -1) {
          newOccupancy[occupiedIndex] = 0;
        }
        }
      }
      return newOccupancy;
    });
  };

  const checkForAlerts = () => {
    const crowdLevel = getCrowdLevel(currentCount);
    const percentage = (currentCount / busCapacity) * 100;
    const availableSeats = busCapacity - currentCount;
    
    if (percentage > 90) {
      addNotification(`🚨 ${selectedBus}: Critical - Only ${availableSeats} seats left!`);
    } else if (percentage > 75) {
      addNotification(`⚠️ ${selectedBus}: Warning - Only ${availableSeats} seats available`);
    } else if (availableSeats <= 5 && availableSeats > 0) {
      addNotification(`📊 ${selectedBus}: Few seats remaining - ${availableSeats} available`);
    }
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev.slice(0, 4)]);
  };

  const resetSystem = () => {
    setCurrentCount(0);
    setSeatOccupancy(Array(40).fill(0));
    setPassengerHistory([]);
    setNotifications([]);
    setIsAutoMode(false);
  };

  const handleBusSelect = (busName: string) => {
    setSelectedBus(busName);
    resetSystem(); // Reset data when switching buses
  };

  const handleAddBus = (busName: string) => {
    setSavedBuses(prev => [...prev, busName]);
  };

  const crowdLevel = getCrowdLevel(currentCount);
  const occupancyPercentage = (currentCount / busCapacity) * 100;
  const availableSeats = busCapacity - currentCount;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bus Seat Tracker</h1>
                <p className="text-gray-600">Track seat availability in real-time</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Current Time</div>
                <div className="text-lg font-semibold">{currentTime.toLocaleTimeString()}</div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setUserRole(userRole === 'admin' ? 'developer' : 'admin')}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {userRole === 'admin' ? 'Developer Mode' : 'Admin Mode'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Bus Selection */}
        <BusSelector
          selectedBus={selectedBus}
          onBusSelect={handleBusSelect}
          savedBuses={savedBuses}
          onAddBus={handleAddBus}
        />

        {selectedBus && (
          <>
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Available Seats</p>
                    <p className="text-3xl font-bold text-green-600">{availableSeats}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Occupied Seats</p>
                    <p className="text-3xl font-bold text-red-600">{currentCount}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{occupancyPercentage.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Crowd Level</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getCrowdColor(crowdLevel)}`}>
                      {crowdLevel}
                    </span>
                  </div>
                  <AlertTriangle className={`h-8 w-8 ${crowdLevel === 'Overcrowded' ? 'text-red-600' : 'text-yellow-600'}`} />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Capacity</p>
                    <p className="text-3xl font-bold text-blue-600">{busCapacity}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Notification System */}
            <NotificationSystem notifications={notifications} />

            {/* Main Content Grid */}
            <div className="space-y-6 mb-6">
              {/* Bus Layout */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6 text-center">Live Seat Map</h2>
                <EnhancedBusLayout 
                  seatOccupancy={seatOccupancy}
                  crowdLevel={crowdLevel}
                  busName={selectedBus}
                  availableSeats={availableSeats}
                  totalSeats={busCapacity}
                />
              </div>

              {/* Passenger Flow Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Passenger Flow Analytics</h2>
                <PassengerFlowChart 
                  passengerHistory={passengerHistory}
                  busCapacity={busCapacity}
                />
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {passengerHistory.length > 0 ? 
                        Math.max(...passengerHistory.map(d => d.count)) : currentCount}
                    </div>
                    <div className="text-sm text-gray-600">Peak Load</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {passengerHistory.length > 0 ? 
                        (passengerHistory.reduce((sum, d) => sum + d.count, 0) / passengerHistory.length).toFixed(1) : 
                        currentCount}
                    </div>
                    <div className="text-sm text-gray-600">Average Load</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {passengerHistory.length}
                    </div>
                    <div className="text-sm text-gray-600">Data Points</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sensor Controls - Show for developers */}
            {userRole === 'developer' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Developer Testing Controls</h2>
                <SensorControls
                  onSensorEvent={handleSensorEvent}
                  isAutoMode={isAutoMode}
                  onToggleAutoMode={setIsAutoMode}
                  onReset={resetSystem}
                  currentCount={currentCount}
                  busCapacity={busCapacity}
                  simulationSpeed={simulationSpeed}
                  onSpeedChange={setSimulationSpeed}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;