export const getCookie = (name) => {
  const cookie = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return cookie ? cookie[2] : null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

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

export const getScheduledPrice = (schedule) => {
  if (!schedule) { return; }
  const now = new Date();
  const scheduledPrice = schedule.filter(({ startDate, endDate }) => {
    const from = new Date(startDate);
    const to = new Date(endDate);
    return from < now && now < to;
  });
  return scheduledPrice.length ? scheduledPrice[0].price : undefined;
};

export const transactionToAnalytics = (dataLayer, transaction) => {
  const {
    videoId, videoName, price, paymentId,
  } = transaction;
  dataLayer.push({
    ecommerce: {
      purchase: {
        actionField: {
          id: paymentId,
          affiliation: 'Video Page',
          revenue: price,
          coupon: '', // implement PromoCode
        },
        products: [{
          name: videoName,
          id: videoId,
          price,
          category: 'video',
          quantity: 1,
          coupon: '', // implement PromoCode
        }],
      },
    },
  });
};
