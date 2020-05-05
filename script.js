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
  })
  .catch((err) => console.log(err));

  messaging.onMessage(({ data: { notification } }) => {
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
};
