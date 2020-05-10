const toast = (text, duration = 3000) => {
  const toastOptions = {
    text,
    duration,
    className: 'toast',
    gravity: 'top',
    position: 'center',
    backgroundColor: '#f5f6fc',
    stopOnFocus: true,
  };
  Toastify(toastOptions).showToast();
};
