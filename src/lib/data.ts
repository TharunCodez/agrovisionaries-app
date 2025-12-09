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
  { id: 'F001', name: 'Ravi Kumar', region: 'Punjab', devices: 2, status: 'Active', phone: '+919876543210' },
  { id: 'F002', name: 'Priya Sharma', region: 'Haryana', devices: 1, status: 'Active', phone: '+919876543211' },
  { id: 'F003', name: 'Amit Singh', region: 'Uttar Pradesh', devices: 3, status: 'Inactive', phone: '+919876543212' },
  { id: 'F004', name: 'Sunita Devi', region: 'Punjab', devices: 1, status: 'Active', phone: '+919876543213' },
  { id: 'F005', name: 'Vijay Patel', region: 'Gujarat', devices: 4, status: 'Active', phone: '+919876543214' },
  { id: 'F006', name: 'Meena Kumari', region: 'Rajasthan', devices: 2, status: 'Active', phone: '+919876543215' },
  { id: 'F007', name: 'Sanjay Reddy', region: 'Andhra Pradesh', devices: 3, status: 'Active', phone: '+919876543216' },
  { id: 'F008', name: 'Anjali Desai', region: 'Maharashtra', devices: 2, status: 'Inactive', phone: '+919876543217' },
];

export const deviceData = [
    { id: 'LIV-001', farmerId: 'F001', name: 'North Field Pump', location: 'North Field', status: 'Online' as const, lastUpdated: new Date(Date.now() - 2 * 60 * 1000), region: 'Punjab', lat: 30.7333, lng: 76.7794, temperature: 32, humidity: 45, soilMoisture: 65, rssi: -78, health: 'Excellent' as const, waterLevel: 80, type: 'Multi-Sensor' },
    { id: 'LIV-002', farmerId: 'F001', name: 'East Field Sensor', location: 'East Field', status: 'Online' as const, lastUpdated: new Date(Date.now() - 5 * 60 * 1000), region: 'Punjab', lat: 30.7350, lng: 76.7810, temperature: 34, humidity: 42, soilMoisture: 68, rssi: -82, health: 'Good' as const, waterLevel: 75, type: 'Multi-Sensor' },
    { id: 'LIV-003', farmerId: 'F002', name: 'Main Farmland', location: 'Main Farmland', status: 'Warning' as const, lastUpdated: new Date(Date.now() - 15 * 60 * 1000), region: 'Haryana', lat: 29.9700, lng: 76.8800, temperature: 35, humidity: 40, soilMoisture: 55, rssi: -90, health: 'Warning' as const, waterLevel: 45, type: 'Soil Moisture Sensor' },
    { id: 'LIV-004', farmerId: 'F003', name: 'Orchard Monitor', location: 'Orchard', status: 'Offline' as const, lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000), region: 'Uttar Pradesh', lat: 27.1800, lng: 78.0200, temperature: 30, humidity: 50, soilMoisture: 60, rssi: -110, health: 'Poor' as const, waterLevel: 30, type: 'Multi-Sensor' },
    { id: 'LIV-005', farmerId: 'F004', name: 'West Plot Station', location: 'West Plot', status: 'Online' as const, lastUpdated: new Date(Date.now() - 1 * 60 * 1000), region: 'Punjab', lat: 30.7400, lng: 76.7700, temperature: 31, humidity: 48, soilMoisture: 72, rssi: -75, health: 'Excellent' as const, waterLevel: 90, type: 'Water Level Sensor' },
    { id: 'LIV-006', farmerId: 'F005', name: 'Cotton Field 1', location: 'Cotton Field 1', status: 'Online' as const, lastUpdated: new Date(Date.now() - 10 * 60 * 1000), region: 'Gujarat', lat: 22.3094, lng: 72.1362, temperature: 36, humidity: 38, soilMoisture: 50, rssi: -85, health: 'Good' as const, waterLevel: 60, type: 'Multi-Sensor' },
    { id: 'LIV-007', farmerId: 'F005', name: 'Cotton Field 2', location: 'Cotton Field 2', status: 'Critical' as const, lastUpdated: new Date(Date.now() - 30 * 60 * 1000), region: 'Gujarat', lat: 22.3100, lng: 72.1400, temperature: 38, humidity: 35, soilMoisture: 45, rssi: -95, health: 'Warning' as const, waterLevel: 25, type: 'Pump Controller' },
    { id: 'LIV-008', farmerId: 'F006', name: 'Desert Plot', location: 'Desert Plot', status: 'Online' as const, lastUpdated: new Date(Date.now() - 12 * 60 * 1000), region: 'Rajasthan', lat: 26.9124, lng: 75.7873, temperature: 39, humidity: 25, soilMoisture: 35, rssi: -88, health: 'Good' as const, waterLevel: 55, type: 'Multi-Sensor' },
    { id: 'LIV-009', farmerId: 'F007', name: 'Paddy Field East', location: 'Paddy Field East', status: 'Online' as const, lastUpdated: new Date(Date.now() - 3 * 60 * 1000), region: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, temperature: 33, humidity: 60, soilMoisture: 75, rssi: -80, health: 'Excellent' as const, waterLevel: 85, type: 'Multi-Sensor' },
    { id: 'LIV-010', farmerId: 'F007', name: 'Paddy Field West', location: 'Paddy Field West', status: 'Warning' as const, lastUpdated: new Date(Date.now() - 25 * 60 * 1000), region: 'Andhra Pradesh', lat: 16.5070, lng: 80.6450, temperature: 34, humidity: 58, soilMoisture: 70, rssi: -88, health: 'Good' as const, waterLevel: 50, type: 'Soil Moisture Sensor' },
    { id: 'LIV-011', farmerId: 'F008', name: 'Sugarcane North', location: 'Sugarcane North', status: 'Offline' as const, lastUpdated: new Date(Date.now() - 8 * 60 * 60 * 1000), region: 'Maharashtra', lat: 18.5204, lng: 73.8567, temperature: 31, humidity: 55, soilMoisture: 62, rssi: -105, health: 'Poor' as const, waterLevel: 40, type: 'Multi-Sensor' },
    { id: 'LIV-012', farmerId: 'F003', name: 'Vegetable Patch', location: 'Vegetable Patch', status: 'Online' as const, lastUpdated: new Date(Date.now() - 7 * 60 * 1000), region: 'Uttar Pradesh', lat: 27.1850, lng: 78.0250, temperature: 30, humidity: 52, soilMoisture: 68, rssi: -81, health: 'Excellent' as const, waterLevel: 78, type: 'Multi-Sensor' },
    { id: 'LIV-013', farmerId: 'F003', name: 'Grain Silo', location: 'Grain Silo', status: 'Critical' as const, lastUpdated: new Date(Date.now() - 45 * 60 * 1000), region: 'Uttar Pradesh', lat: 27.1750, lng: 78.0300, temperature: 29, humidity: 54, soilMoisture: 66, rssi: -92, health: 'Warning' as const, waterLevel: 20, type: 'Water Level Sensor' },
    { id: 'LIV-014', farmerId: 'F005', name: 'New Plot', location: 'New Plot', status: 'Online' as const, lastUpdated: new Date(Date.now() - 9 * 60 * 1000), region: 'Gujarat', lat: 22.3150, lng: 72.1420, temperature: 35, humidity: 40, soilMoisture: 58, rssi: -84, health: 'Good' as const, waterLevel: 65, type: 'Multi-Sensor' },
    { id: 'LIV-015', farmerId: 'F006', name: 'Secondary Well', location: 'Secondary Well', status: 'Online' as const, lastUpdated: new Date(Date.now() - 11 * 60 * 1000), region: 'Rajasthan', lat: 26.9180, lng: 75.7900, temperature: 38, humidity: 28, soilMoisture: 40, rssi: -86, health: 'Excellent' as const, waterLevel: 70, type: 'Water Level Sensor' },
    { id: 'LIV-016', farmerId: 'F007', name: 'Fish Farm Monitor', location: 'Fish Farm', status: 'Online' as const, lastUpdated: new Date(Date.now() - 1 * 60 * 1000), region: 'Andhra Pradesh', lat: 16.5100, lng: 80.6500, temperature: 28, humidity: 70, soilMoisture: 80, rssi: -79, health: 'Excellent' as const, waterLevel: 95, type: 'Multi-Sensor' },
];


export const regionalAnalyticsData = [
    { region: 'Punjab', waterUsage: 4500, farmers: 120 },
    { region: 'Haryana', waterUsage: 3200, farmers: 85 },
    { region: 'Uttar Pradesh', waterUsage: 5100, farmers: 150 },
    { region: 'Gujarat', waterUsage: 4000, farmers: 110 },
    { region: 'Rajasthan', waterUsage: 2800, farmers: 70 },
    { region: 'Andhra Pradesh', waterUsage: 6200, farmers: 95 },
    { region: 'Maharashtra', waterUsage: 5800, farmers: 130 },
];
