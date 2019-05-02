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

export const sort = array => array.sort((a, b) => {
  const typeA = a.toUpperCase();
  const typeB = b.toUpperCase();
  // eslint-disable-next-line no-nested-ternary
  return (typeA < typeB) ? -1 : (typeA > typeB) ? 1 : 0;
});

export const getWindowHeight = (triggerHeight, component) => {
  const { shrink } = component.state;
  const distanceY = window.pageYOffset
    || document.documentElement.scrollTop;
  const shouldShrink = distanceY > triggerHeight;
  if (shouldShrink && !shrink) {
    component.setState({ shrink: true });
  } else if (!shouldShrink && shrink) {
    component.setState({ shrink: false });
  }
};
