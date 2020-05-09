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
      const { data } = await axios.post(`http://localhost:3128/topicsub/13/${token}`);
      console.log(data);

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/firebase-messaging-sw.js')
          .then((registration) => console.log(registration));
      }
    })
    .catch((err) => console.log(err));

  messaging.onMessage(({ data: { title, body, url }}) => {
    return navigator.serviceWorker.ready
      .then((registration) => {
        registration.showNotification(title, {
          body,
          data: { url },
        });
      });
  });
};
