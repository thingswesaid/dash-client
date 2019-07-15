import React from 'react';
import './index.css';

export default () => (
  <div className="footerContainer">
    <div className="footer">
      <div className="firstSection">
        <img src="https://res.cloudinary.com/dw4v960db/image/upload/v1556328141/dashinbetween.png" alt="Dash in Between Tarot Zodiac" />
        <a href="/terms">Terms of Service</a>
        <a href="/help">Help</a>
      </div>
      <div className="secondSection">
        <p>STAY CONNECTED</p>
        <div className="socials">
          <a href="https://www.instagram.com/dash.inbetween/?hl=en" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram" />
          </a>
          <a href="https://www.youtube.com/channel/UCXijIQQdb6XX8zhPJWAxPHQ/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-youtube" />
          </a>
          {/* <a href="https://swww.socials.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-square" />
          </a>
          <a href="https://swww.socials.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-tumblr-square" />
          </a> */}
        </div>
      </div>
    </div>
  </div>
);
