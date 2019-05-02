import React from 'react';
import './index.css';

export default ({
  title, text, image, onClick,
}) => (
  <div
    className="modalContainer"
    onClick={onClick}
    onKeyDown={onClick}
    role="presentation"
  >
    <div className="modal">
      <i className="fas fa-times-circle" />
      <h3>{title}</h3>
      <p>{text}</p>
      <img src={image} alt="modal instruction" />
    </div>
  </div>
);
