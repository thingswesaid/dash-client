import React from 'react';

import { removeCookie } from '../../cookieUtils';
import { COOKIE_USER_TOKEN, COOKIE_USER_ID } from '../../constants';

export default ({ id }) => (
  <div
    style={{
      width: "100vw",
      height: "50vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      color: "#30e29f",
    }}
  >
    <p>
      COMING SOON. CHECK BACK IN FEW DAYS.
    </p>
    <button
      style={{
        border: "1px solid gray",
        borderRadius: "10px",
        padding: "10px 20px",
      }}
      onClick={() => { 
        removeCookie(COOKIE_USER_TOKEN) 
        removeCookie(COOKIE_USER_ID) 
        window.location.assign('/');
      }}
    >LOG OUT</button>
  </div>
)
