import React from 'react';
import './index.css';

export default ({ message }) => (
  <div className="error">
    <img src="https://s3.us-west-1.wasabisys.com/dash-misc/Moon.png" alt="Dash in Between Tarot error" />
    <div className="content">
      <p>{message}</p>
      <div className="line" />
      <a href="/">
        <button type="button">GO BACK</button>
      </a>
    </div>
  </div>
);
