import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeFirebase, useFirestore } from '@/firebase';

export interface AppNotification {
  id: string;
  type:
    | 'pump_on'
    | 'pump_off'
    | 'rain_alert'
    | 'water_low'
    | 'soil_low'
    | 'device_offline';
  title: string;
  message: string;
  timestamp: any; // Firestore Timestamp
  read: boolean;
  urgency: 'high' | 'medium' | 'low';
}

/**
 * Requests permission to send push notifications and saves the token.
 * @param userId The ID of the current user.
 */
export async function setupFCM(userId: string) {
  const { firebaseApp, firestore } = initializeFirebase();
  const messaging = getMessaging(firebaseApp);

  // Request permission
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted.');
    // Get token
    const fcmToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
    });
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      // Save token to Firestore
      const tokenRef = doc(firestore, `farmers/${userId}/fcmTokens`, fcmToken);
      // setDocumentNonBlocking from @/firebase/non-blocking-updates is not available here
      // so we use setDoc directly with a catch block.
      await setDoc(tokenRef, { token: fcmToken, createdAt: new Date() }).catch(
        (err) => console.error('Failed to save FCM token', err)
      );
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } else {
    console.log('Unable to get permission to notify.');
  }

  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    // Customize notification here
    const notificationTitle = payload.notification?.title || 'New Alert';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: '/firebase-logo.png', // a default icon
    };

    new Notification(notificationTitle, notificationOptions);
  });
}

/**
 * Listens for new notifications for a specific user from Firestore.
 * @param userId The ID of the user to fetch notifications for.
 * @param callback A function to call with the new notifications.
 * @returns An unsubscribe function.
 */
export function listenForNotifications(
  userId: string,
  callback: (notifications: AppNotification[]) => void
): () => void {
  const { firestore } = initializeFirebase();
  if (!firestore || !userId) {
    return () => {};
  }

  const notificationsRef = collection(
    firestore,
    `farmers/${userId}/notifications`
  );
  const q = query(notificationsRef, orderBy('timestamp', 'desc'), limit(50));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const notifications: AppNotification[] = [];
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() } as AppNotification);
      });
      callback(notifications);
    },
    (error) => {
      console.error('Error listening for notifications:', error);
    }
  );

  return unsubscribe;
}

/**
 * Marks a notification as read in Firestore.
 * @param userId The user's ID.
 * @param notificationId The ID of the notification to mark as read.
 */
export async function markNotificationAsRead(
  userId: string,
  notificationId: string
): Promise<void> {
  const { firestore } = initializeFirebase();
  if (!firestore || !userId || !notificationId) return;

  const notifRef = doc(
    firestore,
    `farmers/${userId}/notifications`,
    notificationId
  );
  await updateDoc(notifRef, { read: true }).catch((err) =>
    console.error('Failed to mark notification as read', err)
  );
}
