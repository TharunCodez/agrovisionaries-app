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
  { id: 'F001', name: 'Ravi Kumar', region: 'Punjab', devices: 5, status: 'Active' },
  { id: 'F002', name: 'Priya Sharma', region: 'Haryana', devices: 3, status: 'Active' },
  { id: 'F003', name: 'Amit Singh', region: 'Uttar Pradesh', devices: 8, status: 'Inactive' },
  { id: 'F004', name: 'Sunita Devi', region: 'Punjab', devices: 4, status: 'Active' },
  { id: 'F005', name: 'Vijay Patel', region: 'Gujarat', devices: 6, status: 'Active' },
  { id: 'F006', name: 'Meena Kumari', region: 'Rajasthan', devices: 2, status: 'Active' },
];

export const deviceData = [
    { id: 'LIV-001', farmerId: 'F001', location: 'North Field', status: 'Online', lastUpdated: '2 minutes ago', region: 'Punjab' },
    { id: 'LIV-002', farmerId: 'F001', location: 'East Field', status: 'Online', lastUpdated: '5 minutes ago', region: 'Punjab' },
    { id: 'LIV-003', farmerId: 'F002', location: 'Main Farmland', status: 'Warning', lastUpdated: '15 minutes ago', region: 'Haryana' },
    { id: 'LIV-004', farmerId: 'F003', location: 'Orchard', status: 'Offline', lastUpdated: '6 hours ago', region: 'Uttar Pradesh' },
    { id: 'LIV-005', farmerId: 'F004', location: 'West Plot', status: 'Online', lastUpdated: '1 minute ago', region: 'Punjab' },
    { id: 'LIV-006', farmerId: 'F005', location: 'Cotton Field 1', status: 'Online', lastUpdated: '10 minutes ago', region: 'Gujarat' },
    { id: 'LIV-007', farmerId: 'F005', location: 'Cotton Field 2', status: 'Critical', lastUpdated: '30 minutes ago', region: 'Gujarat' },
    { id: 'LIV-008', farmerId: 'F006', location: 'Desert Plot', status: 'Online', lastUpdated: '12 minutes ago', region: 'Rajasthan' },
];

export const regionalAnalyticsData = [
    { region: 'Punjab', waterUsage: 4500, farmers: 120 },
    { region: 'Haryana', waterUsage: 3200, farmers: 85 },
    { region: 'Uttar Pradesh', waterUsage: 5100, farmers: 150 },
    { region: 'Gujarat', waterUsage: 4000, farmers: 110 },
    { region: 'Rajasthan', waterUsage: 2800, farmers: 70 },
];
