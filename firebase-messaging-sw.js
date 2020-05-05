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

messaging.setBackgroundMessageHandler(({ data: { notification } }) => {
  const { title, body }  = (() => {
    if (typeof notification === 'string') {
      return JSON.parse(notification);
    }
    return notification;
  })();
	return self.registration.showNotification(title, {
    body,
  });
});
