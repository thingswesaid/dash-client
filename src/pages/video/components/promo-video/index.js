import React, { Fragment } from 'react';
import Media from 'react-media';
import Image from '../../../../shared-components/image';
import './index.css';

// will have to come from API - onClick takes you to youtube on new tab
export default ({
  video: {
    link, title, description, image, placeholder,
  },
}) => (
  <Fragment>
    <Media query="(min-width: 970px)">
      {matches => (matches ? (
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
      ) : '')
      }
    </Media>
  </Fragment>
);
