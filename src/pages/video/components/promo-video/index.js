import React from 'react';
import Media from 'react-media';
import Image from '../../../../shared-components/image';
import './index.css';

export default ({
  orientation,
  video: {
    link, description, image, placeholder, banner, bannerMobile,
  },
}) => (orientation === 'portrait' ? (
  <div className="promoVideo">
    <a href={`/video/${link}`} rel="noopener noreferrer">
      <div className="imageContainer">
        <button className="image-container shadow" type="button">
          <Image src={image} placeholder={placeholder} />
        </button>
      </div>
      <p className="description">{description}</p>
      <button className="watchYoutube">WATCH NOW</button>
    </a>
  </div>
) : (
  <a
    href={`/video/${link}`}
    rel="noopener noreferrer"
    className="promoVideoMobile"
  >
    <Media query="(min-width: 645px)">
      {matches => (matches ? (
        <img src={banner} alt="Dash in Between Tarot promo banner" />
      ) : (
        <img src={bannerMobile} alt="Dash in Between Tarot promo banner" />
      ))
          }
    </Media>
  </a>
));
