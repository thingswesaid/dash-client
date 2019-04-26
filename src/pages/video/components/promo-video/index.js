import React from 'react';
import Image from '../../../../shared-components/image';
import './index.css';

export default ({
  video: {
    link, title, description, image, placeholder,
  },
}) => (
  <div className="promoVideo">
    <a href={link} target="_blank" rel="noopener noreferrer">
      <p className="sectionTitle">POPULAR READING</p>
      <div className="imageContainer">
        <button className="image-container shadow" type="button">
          <Image image={image} placeholder={placeholder} className="image" />
        </button>
        <p className="title">{title}</p>
      </div>
      <p className="description">{description}</p>
    </a>
  </div>
);
