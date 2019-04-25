import React from 'react';
import bannerImage from '../../../../assets/images/banner1.jpg';
import './index.css';

// will have to come from API - onClick takes you to youtube on new tab
export default () => (
  <div className="promoVideo">
    <p className="sectionTitle">POPULAR READING</p>
    <div className="imageContainer">
      <button className="image-container shadow">
        <img src={bannerImage} />
      </button>
      <p className="title">Is he/she thinking about me?</p>
    </div>
    <p className="description">Check out this pick-a-card reading to find out if the person you're thinking about is thinking about you as well.</p>
  </div>
);
