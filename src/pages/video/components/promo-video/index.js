import React from 'react';
import Media from 'react-media';
import Image from '../../../../shared-components/image';
import './index.css';

export default ({
  orientation,
  video: {
    link, title, description, image, placeholder, banner, bannerSmall,
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
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="promoVideoMobile"
  >
    <Media query="(min-width: 645px)">
      {matches => (matches ? (
        <img src={banner} alt="Dash in Between promo banner" />
      ) : (
        <img src={bannerSmall} alt="Dash in Between promo banner" />
      ))
          }
    </Media>
  </a>
));
