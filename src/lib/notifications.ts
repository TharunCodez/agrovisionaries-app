export interface AppNotification {
  id: string;
  type: 'pump_on' | 'pump_off' | 'rain_alert' | 'water_low' | 'soil_low' | 'device_offline';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  urgency: 'high' | 'medium' | 'low';
}

// Mock data for notifications
const mockNotifications: AppNotification[] = [
  {
    id: '1',
    type: 'water_low',
    title: 'Reservoir Water Low',
    message: 'Water level in North Field Pump is at 20%. Consider refilling.',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    read: false,
    urgency: 'high',
  },
  {
    id: '2',
    type: 'soil_low',
    title: 'Dry Soil Detected',
    message: 'Soil moisture in East Field Sensor is below 30%. Irrigation may be needed.',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    read: false,
    urgency: 'medium',
  },
  {
    id: '3',
    type: 'pump_on',
    title: 'Pump Activated',
    message: 'Irrigation pump for North Field Pump was turned ON.',
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    read: true,
    urgency: 'low',
  },
   {
    id: '4',
    type: 'rain_alert',
    title: 'Heavy Rain Forecasted',
    message: 'Heavy rain is expected in your area in the next 3 hours. Consider pausing irrigation schedules.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    read: true,
    urgency: 'medium',
  },
];


/**
 * Placeholder function to listen for new notifications.
 * In a real app, this would subscribe to Firestore or an FCM topic.
 * @param userId The ID of the user to fetch notifications for.
 * @param callback A function to call with the new notifications.
 * @returns An unsubscribe function.
 */
export function listenForNotifications(
  userId: string,
  callback: (notifications: AppNotification[]) => void
): () => void {
  console.log(`Setting up notification listener for user ${userId}...`);

  // Immediately invoke callback with mock data
  callback(mockNotifications);

  // Simulate a new notification arriving after 15 seconds
  const interval = setInterval(() => {
    const newNotification: AppNotification = {
      id: Math.random().toString(36).substring(2),
      type: 'pump_off',
      title: 'Pump Deactivated',
      message: 'Irrigation pump for North Field Pump was turned OFF automatically.',
      timestamp: Date.now(),
      read: false,
      urgency: 'low',
    };
    // Add to the top of the list
    mockNotifications.unshift(newNotification);
    callback([...mockNotifications]); // Pass a new array to trigger re-render
     console.log('Simulated new notification received.');
  }, 30000); // every 30 seconds

  // Return an "unsubscribe" function
  return () => {
    console.log('Tearing down notification listener.');
    clearInterval(interval);
  };
}


/**
 * Placeholder to mark a notification as read.
 * @param userId The user's ID.
 * @param notificationId The ID of the notification to mark as read.
 */
export async function markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    console.log(`Marking notification ${notificationId} as read for user ${userId}`);
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
    }
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
}
