export const getCookie = (name) => {
  const cookie = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return cookie ? cookie[2] : null;
};

// make select only published (might have to be recursive)
export const shuffle = (startArray) => {
  const array = startArray || [];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    // TODO if (array[i].published) {
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.slice(0, 12);
};
