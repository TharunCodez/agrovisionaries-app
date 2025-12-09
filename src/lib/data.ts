export const waterLevelData = [
  { date: 'Mon', level: 65 },
  { date: 'Tue', level: 62 },
  { date: 'Wed', level: 68 },
  { date: 'Thu', level: 60 },
  { date: 'Fri', level: 55 },
  { date: 'Sat', level: 58 },
  { date: 'Sun', level: 53 },
];

export const soilMoistureData = [
  { date: 'Mon', moisture: 45 },
  { date: 'Tue', moisture: 48 },
  { date: 'Wed', moisture: 42 },
  { date: 'Thu', moisture: 55 },
  { date: 'Fri', moisture: 50 },
  { date: 'Sat', moisture: 47 },
  { date: 'Sun', moisture: 52 },
];

export const weatherForecastData = [
    { day: 'Today', temp: '32°C', condition: 'Sunny', icon: 'Sun' },
    { day: 'Tue', temp: '30°C', condition: 'Partly Cloudy', icon: 'Cloudy' },
    { day: 'Wed', temp: '28°C', condition: 'Showers', icon: 'CloudRain' },
    { day: 'Thu', temp: '31°C', condition: 'Sunny', icon: 'Sun' },
] as const;


export const farmerData = [
  { id: 'F001', name: 'Ravi Kumar', region: 'Punjab', devices: 2, status: 'Active' },
  { id: 'F002', name: 'Priya Sharma', region: 'Haryana', devices: 1, status: 'Active' },
  { id: 'F003', name: 'Amit Singh', region: 'Uttar Pradesh', devices: 1, status: 'Inactive' },
  { id: 'F004', name: 'Sunita Devi', region: 'Punjab', devices: 1, status: 'Active' },
  { id: 'F005', name: 'Vijay Patel', region: 'Gujarat', devices: 2, status: 'Active' },
  { id: 'F006', name: 'Meena Kumari', region: 'Rajasthan', devices: 1, status: 'Active' },
];

export const deviceData = [
    { id: 'LIV-001', farmerId: 'F001', name: 'North Field Pump', location: 'North Field', status: 'Online', lastUpdated: new Date(Date.now() - 2 * 60 * 1000), region: 'Punjab', lat: 30.7333, lng: 76.7794, temperature: 32, humidity: 45, soilMoisture: 65, rssi: -78, health: 'Excellent' as const, waterLevel: 80 },
    { id: 'LIV-002', farmerId: 'F001', name: 'East Field Sensor', location: 'East Field', status: 'Online', lastUpdated: new Date(Date.now() - 5 * 60 * 1000), region: 'Punjab', lat: 30.7350, lng: 76.7810, temperature: 34, humidity: 42, soilMoisture: 68, rssi: -82, health: 'Good' as const, waterLevel: 75 },
    { id: 'LIV-003', farmerId: 'F002', name: 'Main Farmland', location: 'Main Farmland', status: 'Warning', lastUpdated: new Date(Date.now() - 15 * 60 * 1000), region: 'Haryana', lat: 29.9700, lng: 76.8800, temperature: 35, humidity: 40, soilMoisture: 55, rssi: -90, health: 'Warning' as const, waterLevel: 45 },
    { id: 'LIV-004', farmerId: 'F003', name: 'Orchard Monitor', location: 'Orchard', status: 'Offline', lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000), region: 'Uttar Pradesh', lat: 27.1800, lng: 78.0200, temperature: 30, humidity: 50, soilMoisture: 60, rssi: -110, health: 'Poor' as const, waterLevel: 30 },
    { id: 'LIV-005', farmerId: 'F004', name: 'West Plot Station', location: 'West Plot', status: 'Online', lastUpdated: new Date(Date.now() - 1 * 60 * 1000), region: 'Punjab', lat: 30.7400, lng: 76.7700, temperature: 31, humidity: 48, soilMoisture: 72, rssi: -75, health: 'Excellent' as const, waterLevel: 90 },
    { id: 'LIV-006', farmerId: 'F005', name: 'Cotton Field 1', location: 'Cotton Field 1', status: 'Online', lastUpdated: new Date(Date.now() - 10 * 60 * 1000), region: 'Gujarat', lat: 22.3094, lng: 72.1362, temperature: 36, humidity: 38, soilMoisture: 50, rssi: -85, health: 'Good' as const, waterLevel: 60 },
    { id: 'LIV-007', farmerId: 'F005', name: 'Cotton Field 2', location: 'Cotton Field 2', status: 'Critical', lastUpdated: new Date(Date.now() - 30 * 60 * 1000), region: 'Gujarat', lat: 22.3100, lng: 72.1400, temperature: 38, humidity: 35, soilMoisture: 45, rssi: -95, health: 'Warning' as const, waterLevel: 25 },
    { id: 'LIV-008', farmerId: 'F006', name: 'Desert Plot', location: 'Desert Plot', status: 'Online', lastUpdated: new Date(Date.now() - 12 * 60 * 1000), region: 'Rajasthan', lat: 26.9124, lng: 75.7873, temperature: 39, humidity: 25, soilMoisture: 35, rssi: -88, health: 'Good' as const, waterLevel: 55 },
];


export const regionalAnalyticsData = [
    { region: 'Punjab', waterUsage: 4500, farmers: 120 },
    { region: 'Haryana', waterUsage: 3200, farmers: 85 },
    { region: 'Uttar Pradesh', waterUsage: 5100, farmers: 150 },
    { region: 'Gujarat', waterUsage: 4000, farmers: 110 },
    { region: 'Rajasthan', waterUsage: 2800, farmers: 70 },
];
