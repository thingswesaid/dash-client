import React from 'react';
import './index.css';

// will have to come from API - onClick takes you to youtube on new tab
export default ({
  video: {
    link, title, description, image,
  },
}) => (
  <div className="promoVideo">
    <a href={link} target="_blank" rel="noopener noreferrer">
      <p className="sectionTitle">POPULAR READING</p>
      <div className="imageContainer">
        <button className="image-container shadow" type="button">
          <img src={image} alt="reading video placeholder" />
        </button>
        <p className="title">{title}</p>
      </div>
      <p className="description">{description}</p>
    </a>
  </div>
);
