importScripts('https://www.gstatic.com/firebasejs/5.9.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.9.2/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCvnGL_lxwdqxYsbmZiBjvzd23L-rTHwRs',
  authDomain: 'dimi-online-notification.firebaseapp.com',
  databaseURL: 'https://dimi-online-notification.firebaseio.com',
  projectId: 'dimi-online-notification',
  storageBucket: 'dimi-online-notification.appspot.com',
  messagingSenderId: '839786842905',
  appId: '1:839786842905:web:44ef84a594135395ea9388',
});

const messaging = firebase.messaging()
console.log('hello')

messaging.setBackgroundMessageHandler(({ data: { title, body, url } }) => {
	return self.registration.showNotification(title, {
    body,
    data: { url },
  });
});

self.addEventListener('notificationclick', (event) => {
  console.log(event);
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url),
  );
});
