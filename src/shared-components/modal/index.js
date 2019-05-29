import React from 'react';
import Modal from 'react-modal';
import './index.css';

export default ({
  title, text, image, onClick,
}) => (
  <Modal isOpen className="modalContainer" ariaHideApp={false}>
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
        {image ? <img src={image} alt="modal instruction" /> : ''}
      </div>
    </div>
  </Modal>
);
