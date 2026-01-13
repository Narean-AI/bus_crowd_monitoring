export type SensorEvent = 'entry' | 'exit';

export type CrowdLevel = 'Low' | 'Moderate' | 'High' | 'Overcrowded';

export interface PassengerData {
  timestamp: Date;
  count: number;
  crowdLevel: CrowdLevel;
}

export interface BusStatus {
  id: string;
  route: string;
  currentCount: number;
  capacity: number;
  lastUpdate: Date;
  crowdLevel: CrowdLevel;
  busName: string;
}