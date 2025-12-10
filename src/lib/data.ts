import { Timestamp } from 'firebase/firestore';
import { type Device, type Farmer } from '@/contexts/data-context';

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
    { day: 'Today', temp: '22°C', condition: 'Sunny', icon: 'Sun' },
    { day: 'Tue', temp: '20°C', condition: 'Partly Cloudy', icon: 'Cloudy' },
    { day: 'Wed', temp: '18°C', condition: 'Showers', icon: 'CloudRain' },
    { day: 'Thu', temp: '21°C', condition: 'Sunny', icon: 'Sun' },
] as const;


export const regionalAnalyticsData = [
    { region: 'Jorethang', waterUsage: 4500, soilMoisture: 68, farmers: 120 },
    { region: 'Melli', waterUsage: 3200, soilMoisture: 62, farmers: 85 },
    { region: 'Namchi', waterUsage: 5100, soilMoisture: 75, farmers: 150 },
    { region: 'Ravangla', waterUsage: 4000, soilMoisture: 55, farmers: 110 },
    { region: 'Borong', waterUsage: 2800, soilMoisture: 60, farmers: 70 },
    { region: 'Sumbuk', waterUsage: 6200, soilMoisture: 78, farmers: 95 },
    { region: 'Yangang', waterUsage: 5800, soilMoisture: 65, farmers: 130 },
    { region: 'Tareythang', waterUsage: 3500, soilMoisture: 70, farmers: 80 },
];
