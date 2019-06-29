import { toast as notification } from 'react-toastify';

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;`;
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

const isOldBrowser = (browserName, browserVersion) => {
  const oldBrowsers = [
    { name: "Chrome", version: 43 },
    { name: "Safari", version: 9 },
    { name: "Opera", version: 37 },
    { name: "IE", version: 11 }
  ]

  const isPresent = oldBrowsers.filter(({name, version}) => name === browserName && browserVersion <= version);
  return !!isPresent.length
}

export const browserCheck = () => {
  var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
  if(/trident/i.test(M[1])){
      tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
      return {name:'IE',version:(tem[1]||'')};
      }   
  if(M[1]==='Chrome'){
      tem=ua.match(/\bOPR|Edge\/(\d+)/)
      if(tem!=null)   {return {name:'Opera', version:tem[1]};}
      }   
  M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
  if (isOldBrowser(M[0],M[1])) {
    notification.info(`Old browser deteceted. Please update for optimal experience on our website.`);
  }
  return {
    name: M[0],
    version: M[1]
  };
}

export const getUrlParams = () => {
    let params = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    const keyFormatted = decodeURIComponent(key);
    const valueFormatted = decodeURIComponent(value);
    params[keyFormatted] = valueFormatted;
  });
  return params;
}

export const validateField = (type, value) => {
  if (type === 'email') {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(value));
  } else if (type === 'password') {
    return value.length >= 6;
  }
}