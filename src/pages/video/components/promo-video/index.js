import React from 'react';
import Image from '../../../../shared-components/image';
import './index.css';

export default ({
  orientation,
  video: {
    link, title, description, image, placeholder,
  },
}) => (orientation === 'portrait' ? (
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
) : (
  <div
    className="promoVideoMobile"
    style={{ background: `url(${image}), no-repeat` }}
  >
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="promoBackground"
    >
      <p className="title">{title}</p>
      <p className="description">PICK A CARD READING</p>
    </a>
  </div>
));
