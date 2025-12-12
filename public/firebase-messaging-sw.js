// /public/firebase-messaging-sw.js

// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5TJ8aLFr1YCeDR-PTish_madUiMqJBB4",
  authDomain: "studio-9156404750-b637f.firebaseapp.com",
  projectId: "studio-9156404750-b637f",
  storageBucket: "studio-9156404750-b637f.appspot.com",
  messagingSenderId: "545867839750",
  appId: "1:545867839750:web:1fa08a994b50d2f7fa4687"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/AgroVisionaries_Green.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
