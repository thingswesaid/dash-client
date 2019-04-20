import React from 'react';

import './index.css';
import DashLogo from '../../assets/images/dash-logo.png';

// show mosaic with all other videos - VIDEO NOT FOUND in the middle - can click on other videos
export default () => (
  <div className="navbar">
    <img src={DashLogo} alt="dash in between logo" />
  </div>
);
