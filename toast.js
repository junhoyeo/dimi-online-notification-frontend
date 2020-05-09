const toast = (text) => {
  const toastOptions = {
    text,
    duration: 3000,
    className: 'toast',
    gravity: 'top',
    position: 'center',
    backgroundColor: '#f5f6fc',
    stopOnFocus: true,
  };
  Toastify(toastOptions).showToast();
};
