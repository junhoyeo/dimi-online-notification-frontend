const initializeFirebase = async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log(firebaseConfig);
        firebase.initializeApp(firebaseConfig);

        const messaging = firebase.messaging();
        messaging
          .requestPermission()
          .then(() => messaging.getToken())
          .then(async (token) => {
            // await fetch('/register', { method: 'post', body: token });
            // messaging.onMessage(({ notification: { title, body }}) =>
            //   navigator.serviceWorker.ready
            //     .then((registration) =>
            //       registration.showNotification(title, { body })));
            console.log(token);
          })
          .catch((err) => console.log(err));
      });
  }
};
