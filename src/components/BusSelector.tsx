import React, { useState } from 'react';
import { Bus, Search, Plus } from 'lucide-react';

interface BusSelectorProps {
  selectedBus: string;
  onBusSelect: (busName: string) => void;
  savedBuses: string[];
  onAddBus: (busName: string) => void;
}

const BusSelector: React.FC<BusSelectorProps> = ({
  selectedBus,
  onBusSelect,
  savedBuses,
  onAddBus
}) => {
  const [newBusName, setNewBusName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddBus = () => {
    if (newBusName.trim() && !savedBuses.includes(newBusName.trim())) {
      onAddBus(newBusName.trim());
      setNewBusName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bus className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Select Bus to Track</h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Bus</span>
        </button>
      </div>

      {/* Add New Bus Form */}
      {showAddForm && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newBusName}
              onChange={(e) => setNewBusName(e.target.value)}
              placeholder="Enter bus name (e.g., Route 42, City Express, etc.)"
              className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddBus()}
            />
            <button
              onClick={handleAddBus}
              disabled={!newBusName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Bus Selection */}
      <div className="space-y-2">
        {savedBuses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bus className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No buses added yet. Click "Add Bus" to start tracking.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedBuses.map((busName) => (
              <button
                key={busName}
                onClick={() => onBusSelect(busName)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedBus === busName
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Bus className={`h-5 w-5 ${selectedBus === busName ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{busName}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedBus && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700 font-medium">Now tracking: {selectedBus}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusSelector;