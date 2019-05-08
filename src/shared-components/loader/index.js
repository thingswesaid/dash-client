import React from 'react';
import rolling from '../../assets/gifs/rolling.gif';

import './index.css';

export default ({
  custom,
  classContainer,
  classContent,
  image,
  title,
  description,
}) => (custom ? (
  <div className={classContainer}>
    <div className={classContent}>
      <img src={image} alt="Dash Loading" />
      <p>{title}</p>
      <p>{description}</p>
    </div>
  </div>
) : (
  <div className="siteLoaderContainer">
    <img src={rolling} alt="Dash Loading" />
  </div>
));
