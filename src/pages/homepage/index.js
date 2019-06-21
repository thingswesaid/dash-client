import React from 'react';

import Search from '../../shared-components/search';
import './index.css';

export default () => (
  <div className="homepage">
    <img
      src="https://s3.us-west-1.wasabisys.com/dash-misc/dashinbetween-logo.png"
      alt="Dash in Between Tarot"
    />
    <Search className="search" />
  </div>
);
