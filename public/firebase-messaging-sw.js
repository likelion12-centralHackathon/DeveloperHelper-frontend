//public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDzOCYbF4ry1XhKZNZ47ZpBXApmNPJ5haw',
  projectId: "developer-timer-da0d7",
  messagingSenderId: "941924952275",
  appId: "1:941924952275:web:7d2b4df882f95dcadb4c26",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('백그라운드 메시지 수신: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,

  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});