function notify() {
  if (Notification.permission === 'denied') {
    alert('알림이 차단되어 있습니다.');
    return;
  }
  Notification.requestPermission((permission) => {
    if (permission === 'granted') {
      new Notification('뿜뿜');
    } else {
      alert('알림이 거부되었습니다.');
    }
  });
}
