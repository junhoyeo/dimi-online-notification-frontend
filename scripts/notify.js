const notify = async (topic) => {
  messaging
    .requestPermission()
    .then(() => messaging.getToken())
    .then(async (token) => {
      console.log(token);
      const { data } = await axios.post(`https://beaver.hanukoon.com/topicsub/${topic}/${token}`);
      console.log(data);

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/firebase-messaging-sw.js')
          .then((registration) => {
            console.log(registration);
            toast('구독 완료! 🙌');
          });
      }
    })
    .catch((err) => console.log(err));

  messaging.onMessage(({ data: { title, body, url }}) => {
    return navigator.serviceWorker.ready
      .then((registration) => {
        registration.showNotification(title, {
          body,
          data: { url },
          icon: 'https://raw.githubusercontent.com/junhoyeo/dimi-online-notification-frontend/master/assets/icon.jpg',
        });
      });
  });
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();
