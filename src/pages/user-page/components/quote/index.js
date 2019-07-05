import React from 'react';

import './index.css';

export default ({ quote: { text, linkTo } }) => {
  return (
    <div className="quoteBorder">
      <a href={linkTo} target="_blank">
        <div className="quote">
          <p className="title">Dash quote</p>
          <p className="main">{text}</p>
          <i className="fab fa-instagram" />
        </div>
      </a>
    </div>
  )
};