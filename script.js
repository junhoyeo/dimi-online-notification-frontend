console.log(firebaseConfig);
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

const notify = async () => {
  messaging
    .requestPermission()
    .then(() => messaging.getToken())
    .then(async (token) => {
      console.log(token);
      // await fetch('/register', { method: 'post', body: token });

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/firebase-messaging-sw.js')
          .then((registration) => console.log(registration));
      }
    })
    .catch((err) => console.log(err));

  messaging.onMessage(({ data: { notification } }) => {
    const { title, body }  = (() => {
      if (typeof notification === 'string') {
        return JSON.parse(notification);
      }
      return notification;
    })();

    return navigator.serviceWorker.ready
      .then((registration) => {
        registration.showNotification(title, {
          body,
        });
      });
  });
};
