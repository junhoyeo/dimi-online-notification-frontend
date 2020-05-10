function setCookieForOneHour(cookieName, cookieValue) {
  let now = new Date();
  const oneHour = 60 * 60 * 1000;
  now.setTime(now.getTime() + oneHour);
  const expires = `expires=${now.toUTCString()}`;
  document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
}

function getCookie(searchedCookieName) {
  const name = `${searchedCookieName}=`;
  const cookies = document.cookie.split(';');
  for (let cookieIndex = 0; cookieIndex < cookies.length; cookieIndex++) {
    const cookie = cookies[cookieIndex].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
}
